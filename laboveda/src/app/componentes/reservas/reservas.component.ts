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
import { UsuarioModel } from '../../Models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit{

  //Objeto de reservas
  reserva: ReservaModel = new ReservaModel();
  usuario: UsuarioModel = new UsuarioModel();

  //Array donde se guardan todas las reservas
  reservas: ReservaModel[] = [];

  //Variables de fechas
  fechaSeleccionada: string;
  fechaAyer = new Date();
  fechaAyerString: string;

  horasApertura = 13; 
  horasCierre = 23; 
  intervaloHoras = 1; 

  horasRestaurante: number[] = [];
  numComensales: number[] = [];
  horasDisponibles: number[] = [];

  fechaInvalida: boolean = false;

  //Comprobadores de los dias y fechas disponibles
  disponible: boolean = true;
  diaDisponible: boolean = true;

  constructor(private httpclient:HttpClient,
              private reservasService: ReservasService,
              private usu: UsuarioService,
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

  scrollTopCabecera(){
    window.scrollTo({ top: 0});
  }

  ngOnInit(): void {
    const id: any = localStorage.getItem('gmail');
    
    if (id !== 'nuevo') {
      this.usu.getUsuario(id).subscribe((resp) => {
        if (resp) {
          const primeraEntrada = Object.entries(resp)[0][0];
          this.usuario = resp as UsuarioModel;
          this.usu.getUsuarioEspe(id,primeraEntrada).subscribe((resp) => {
            this.usuario = resp as UsuarioModel;
            this.reserva.nombre = this.usuario.nombre;
            this.reserva.apellido = this.usuario.apellido;
            this.reserva.gmail = this.usuario.email;
            if(this.usuario.tel != ''){
              this.reserva.tel = this.usuario.tel;
            }
          })
        } else {
          console.log("No se encontró el usuario con el ID proporcionado.");
        }
      });
    } else {
      console.log("ID de usuario no válido.");
    }
  }
  


  //enviar correo
  enviarcorreo() {
    Notiflix.Loading.dots('Reservando..', {
      svgColor: 'rgba(244,204,123,255)'
    })

    let params = {
      email: this.reserva.gmail,
      nombre: this.reserva.nombre,
      apellido: this.reserva.apellido,
      fecha: this.reserva.diaReserva,
      hora: this.reserva.horaResrva,
      comensales: this.reserva.comensales
    }

    this.httpclient.post('http://localhost:3000/envio', params).subscribe(resp => {
      console.log(resp)
    })
  }

  //Se guardan los datos del formulario en una base de datos
  guardar(form:NgForm){
    
    if(this.reserva.horaResrva == 'Seleccione la hora' || this.reserva.comensales == 'Seleccione los comensales'){
      return;
    }


    if(this.fechaSeleccionada < this.fechaAyerString){
      this.fechaInvalida = true;
      Notiflix.Notify.failure('Por favor, complete todos los campos obligatorios.');
      return;
    }
    if(form.invalid){

      Object.values(form.controls).forEach(control => {
        control.markAllAsTouched();
      })

      Notiflix.Notify.failure('Por favor, complete todos los campos obligatorios.');
      return;
    }else{
    
      Notiflix.Loading.dots('Reservando..', {
        svgColor: 'rgba(244,204,123,255)'
      })
  
      let peticion: Observable<any>;
    

      const fechaReserva: Date | null = this.datePipe.transform(this.reserva.diaReserva, 'yyyy-MM-dd') as Date | null;

      if (fechaReserva !== null) {
        this.reserva.diaReserva = fechaReserva;
      } else {
        console.error('Error al convertir la fecha seleccionada a Date');
        return; 
      }

      const id: any = localStorage.getItem('gmail');
      let usuario: UsuarioModel = new UsuarioModel();

      if (id !== 'nuevo') {
        this.usu.getUsuario(id).subscribe((resp) => {
          if (resp) {
            const primeraEntrada = Object.entries(resp)[0][0];
            usuario = resp as UsuarioModel; 
            this.usu.getUsuarioEspe(id,primeraEntrada).subscribe((resp) => {
              usuario = resp as UsuarioModel;
              usuario.numReservas += 1;
              return this.usu.actualizarUsuario(usuario,id,primeraEntrada).subscribe((resp) => {
                console.log('datos actualizados correctamente')
              })
            })
          } else {
          }
        });
      } else {
        console.log("ID de usuario no válido.");
      }
      
      
  
      peticion = this.reservasService.crearReserva(this.reserva);
      peticion.subscribe((resp:ReservaModel) =>{
        this.enviarcorreo();
        this.scrollTopCabecera();
        this.router.navigate(['/']);
        Notiflix.Loading.remove()
        Notiflix.Notify.success('Reserva completada')
        form.reset();
      })
    }
  }

  seleccionarReservas: string = 'Todas';
  maxComensales: number = 0;
  maxComensalesHora: number = 0;


  //Genero las horas y los comensales disponibles 

  maximoComensales(e: Event){
    this.encontrarMejorMesa();
    this.detectarDia()
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
      if(i+max <= 20){
        this.numComensales.push(i);
      }
    }
    if(this.maxComensales >= 20){
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
      if(this.detectarDia() == 'fin de semana'){
        if(i<=15 ||i>=21){
          this.horasRestaurante.push(i);
        }
      }else{
        if(i<=15){
          this.horasRestaurante.push(i);
        }
      }
    }
    this.maxComensalesHora = 0;
  }

  detectarDia(): string {
    const fecha = new Date(this.reserva.diaReserva);
    const diaSemana = fecha.getDay();
    if (diaSemana === 5 || diaSemana === 6 || diaSemana === 0) {
      return 'fin de semana';
    } else {
      return 'día de semana';
    }
  }


  /*Diferencia por mesas*/

  mesasDisponibles1: number[] = [5, 5, 10];
  mesasDisponibles2: number[] = [1, 2, 4, 6, 7];
  mesasDisponibles3: number[] = [2, 4, 6];
  mesasDisponibles4: number[] = [1, 3, 5, 8, 8];
  mesasDisponibles5: number[] = [1, 3, 5, 8, 11];

  mesasIniciales: number[] = [];
  


  contarElementosComunes(array: number[], numero: number): number {
    return array.filter(elemento => elemento === numero).length;
  }

  encontrarMejorMesa(): void {
    this.mesasIniciales = [];
    this.reservasService.getReservas()
      .subscribe(resp => {
        const horasSet = new Set<number>();
        resp.forEach(reserva => {
          if(reserva.diaReserva.toString() === this.reserva.diaReserva.toString()){
            const comensalesReserva: number = parseInt(reserva.comensales);
            let mejorMesa: number[] = [];
            let maxElementosComunes = 0;
            [this.mesasDisponibles1, this.mesasDisponibles2, this.mesasDisponibles3, this.mesasDisponibles4, this.mesasDisponibles5].forEach(mesa => {
              const elementosComunes = this.contarElementosComunes(mesa, comensalesReserva);
              if (elementosComunes > maxElementosComunes) {
                maxElementosComunes = elementosComunes;
                let eliminado = false;
                mesa = mesa.filter(elemento => {
                    if (elemento === comensalesReserva && !eliminado) {
                        eliminado = true;
                        return false; 
                    } else {
                        return true; 
                    }
                });
                mejorMesa = mesa.slice();
              }
            });
            this.mesasIniciales = mejorMesa;
          }
        });
        
      });

  } 
}
