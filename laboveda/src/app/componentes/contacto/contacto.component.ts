import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservasService } from '../../services/reservas.service';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ReservaModel } from '../../Models/reserva.model';
import Notiflix from 'notiflix';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
//Objeto de reservas
reserva: ReservaModel = new ReservaModel();

//Array donde se guardan todas las reservas
reservas: ReservaModel[] = [];

//Variables de fechas
fechaSeleccionada: string;
fechaAyer = new Date();
fechaAyerString: string;

horasApertura = 13; 
horasCierre = 23; 
intervaloHoras = 1; 

horasRestaurante: string[] = [];
numComensales: string[] = [];
horasDisponibles: number[] = [];

fechaInvalida: boolean = false;

//Comprobadores de los dias y fechas disponibles
disponible: boolean = true;
diaDisponible: boolean = true;

constructor(private httpclient:HttpClient,
            private reservasService: ReservasService,
            private route: ActivatedRoute,
            private datePipe: DatePipe,
            private router: Router) {
   
  this.fechaAyer.setDate(this.fechaAyer.getDate() - 1);
  const dia = this.fechaAyer.getDate().toString().padStart(2, '0');
  const mes = (this.fechaAyer.getMonth() + 1).toString().padStart(2, '0');
  const anio = this.fechaAyer.getFullYear();
  this.fechaAyerString = `${anio}-${mes}-${dia}`;
  this.fechaSeleccionada = this.fechaAyerString;

}
ngOnInit(): void {

  //this.horasRestaurante.unshift('Seleccione una hora');
  //console.log(this.horasRestaurante)
  const id: any = this.route.snapshot.paramMap.get('id');

  if (id !== 'nuevo') {
  this.reservasService.getReserva(id)
  .subscribe((resp) => {
    if (resp) {
      this.reserva = resp as ReservaModel; 
      this.reserva.id = id;
    }});
  }
}


//enviar correo a la bóveda
enviarcorreo() {
  Notiflix.Loading.dots('Enviando...', {
    svgColor: 'rgba(244,204,123,255)'
  })

  let params = {
    gmail: this.reserva.gmail,
    nombre: this.reserva.nombre,
    apellido: this.reserva.apellido,
    tel: this.reserva.tel,
    contenido: this.reserva.peticion
  }

  this.httpclient.post('http://localhost:3000/envioContactoCliente', params).subscribe(resp => {
    console.log('correo enviado al cliente')
  })

  this.httpclient.post('http://localhost:3000/envioCorreoContacto', params).subscribe(resp => {
    console.log('correo enviado al restaurante')
  })
}

//Se guardan los datos del formulario en una base de datos
guardar(form:NgForm){
  if(this.fechaSeleccionada < this.fechaAyerString){
    this.fechaInvalida = true;
    Notiflix.Notify.failure('Por favor, complete todos los campos obligatorios.');
    return;
  }
  if(form.invalid){

    Object.values(form.controls).forEach(control => {
      control.markAllAsTouched();
    })

    console.log('formulario no valido')

    Notiflix.Notify.failure('Por favor, complete todos los campos obligatorios.');
    return;
  }else{
  
    Notiflix.Loading.dots('Reservando..', {
      svgColor: 'rgba(244,204,123,255)'
    })

    let peticion: Observable<any>;
  

    const fechaReserva: Date | null = this.datePipe.transform(this.fechaSeleccionada, 'yyyy-MM-dd') as Date | null;

    if (fechaReserva !== null) {
      this.reserva.diaReserva = fechaReserva;
    } else {
      console.error('Error al convertir la fecha seleccionada a Date');
      return; 
    }

    peticion = this.reservasService.crearReserva(this.reserva);
    peticion.subscribe((resp:ReservaModel) =>{
      this.router.navigate(['/']);
      Notiflix.Loading.remove()
      Notiflix.Notify.success('Reserva completada')
      this.enviarcorreo();
      form.reset();
    })
  }
}

seleccionarReservas: string = 'Todas';
maxComensales: number = 0;
maxComensalesHora: number = 0;


//Genero las horas y los comensales disponibles 

maximoComensales(e: Event){
  console.log(this.horasRestaurante)
  if(this.fechaSeleccionada < this.fechaAyerString){
    this.fechaInvalida = true;
    return;
  }else{
    this.fechaInvalida = false;
  }

  this.maxComensales = 0;
  this.maxComensalesHora = 0;

  this.reservasService.getReservas()
    .subscribe(resp => {
      const horasSet = new Set<number>();
      resp.forEach(reserva => {
        if(reserva.diaReserva.toString() === this.fechaSeleccionada.toString()){
          this.maxComensales += parseInt(reserva.comensales.toString());
          if(reserva.horaResrva.toString() === this.reserva.horaResrva.toString()){
            this.maxComensalesHora += parseInt(reserva.comensales.toString());
            if(this.maxComensalesHora > 20){
              horasSet.add(parseInt(reserva.horaResrva));
            }
          }
        }
      });
      this.horasDisponibles = Array.from(horasSet);
      this.generarNumComensales(this.maxComensales);
      this.generarHorasRestaurante(this.maxComensalesHora);
    });
}

private generarNumComensales(max: number){
  this.diaDisponible = true;
  if(this.maxComensalesHora >= 20){
    this.disponible = false;
    this.numComensales = [];
    return;
  }
  this.numComensales = [];
  for(let i = 1; i<=20;i++){
    this.disponible = true;
    if(i+max <= 60){
      this.numComensales.push(i.toString());
    }
  }
  if(this.maxComensales >= 60){
    this.maxComensales = 0;
    this.diaDisponible = false;
    this.disponible = false;
  }
}

private generarHorasRestaurante(max: number) {
  if(!this.diaDisponible){
    this.horasDisponibles = [];
    this.horasRestaurante = [];
    return;
  }
  this.horasRestaurante = []
  for (let i = this.horasApertura; i <= this.horasCierre; i += this.intervaloHoras) {
    if(i<=15 ||i>=21){
      this.horasRestaurante.push(i.toString()+':00');
    }
  }
  this.maxComensalesHora = 0;
}

}
