import { Component, OnInit } from '@angular/core';
import { ReservaModel } from '../../Models/reserva.model';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent implements OnInit{
  
  reserva: ReservaModel = new ReservaModel();

  horasApertura = 13; 
  horasCierre = 23; 
  intervaloHoras = 1; 

  horasRestaurante: number[] = [];
  horasDisponibles: number[] = [];
  numComensales: number[] = [];

  constructor(private reservasService: ReservasService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    const id: any = this.route.snapshot.paramMap.get('id');
    
    if (id !== 'nuevo') {
      this.reservasService.getReserva(id)
        .subscribe((resp) => {
          if (resp) {
            this.reserva = resp as ReservaModel; 
            this.reserva.id = id;
          }
        });
    }
  }
  
  disponible: boolean = true;
  diaDisponible: boolean = true;

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
      this.horasRestaurante = []
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

  guardar(form:NgForm){
    if(form.invalid){
      console.log('formulario no valido')
      return;
    }

    if (this.reserva.diaReserva && this.reserva.horaResrva != 'Hora' && parseInt(this.reserva.comensales) >0) {
      Swal.fire({
        title: 'Espere',
        text: 'Guardando información',
        icon: 'info',
        allowOutsideClick: false
      })
      Swal.showLoading();
  
      let peticion: Observable<any>;
  
      if(this.reserva.id){
        peticion = this.reservasService.actualizarReserva(this.reserva);
        peticion.subscribe((resp) =>{
          Swal.fire({
            title: this.reserva.nombre,
            text: 'Se actualizó correctamente',
            icon: 'success'
          })
        })
      }else{
        peticion = this.reservasService.crearReserva(this.reserva);
        peticion.subscribe((resp) =>{
          Swal.fire({
            title: this.reserva.nombre,
            text: 'Se creó correctamente',
            icon: 'success'
          })
          this.router.navigateByUrl('/reservas')
        })
      }
    }
  }

  seleccionarReservas: string = 'Todas';
  maxComensales: number = 0;
  maxComensalesHora: number = 0;

  maximoComensales(e: Event){
    //this.encontrarMejorMesa();
    this.detectarDia()
    this.maxComensales = 0;
    this.maxComensalesHora = 0;
    this.reservasService.getReservas()
      .subscribe(resp => {
        const horasSet = new Set<number>();
        resp.forEach(reserva => {
          if(reserva.diaReserva.toString() === this.reserva.diaReserva.toString()){
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

  fechaSeleccionada: string = '';

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
/*Diferencia por mesas*/
/*mesasDisponibles1: number[] = [5, 5, 10];
mesasDisponibles2: number[] = [1, 2, 4, 6, 7];
mesasDisponibles3: number[] = [2, 4, 6];
mesasDisponibles4: number[] = [1, 3, 5, 8, 8];
mesasDisponibles5: number[] = [1, 4, 6, 8, 11];

mesasIniciales: number[] = [];

contarElementosComunes(array: number[], numero: number): number {
  return array.filter(elemento => elemento === numero).length;
}
encontrarMejorMesa(): void {
  this.mesasIniciales = [];
  let arrayMesasSeleccionado: number[] | null = null; // Variable para almacenar el array de mesas seleccionado
  this.reservasService.getReservas()
    .subscribe(resp => {
      const horasSet = new Set<number>();
      resp.forEach(reserva => {
        if(reserva.diaReserva.toString() === this.reserva.diaReserva.toString()){
          const comensalesReserva: number = parseInt(reserva.comensales);
          let mejorMesa: number[] = [];
          let maxElementosComunes = 0;
          let mejorMesaIndex: number = -1; // Variable para almacenar el índice del mejor array de mesas disponibles
          
          // Si ya se seleccionó un array de mesas, no es necesario volver a buscar el mejor
          if (arrayMesasSeleccionado === null) {
            [this.mesasDisponibles1, this.mesasDisponibles2, this.mesasDisponibles3, this.mesasDisponibles4, this.mesasDisponibles5].forEach((mesa, index) => {
              const elementosComunes = this.contarElementosComunes(mesa, comensalesReserva);
              if (elementosComunes > maxElementosComunes) {
                mejorMesa = mesa;
                maxElementosComunes = elementosComunes;
                mejorMesaIndex = index; // Almacena el índice del mejor array de mesas disponibles
              }
            });
            
            console.log(`La mejor mesa se encontró en el array de mesasDisponibles${mejorMesaIndex + 1}`);
            
            arrayMesasSeleccionado = (this as any)[`mesasDisponibles${mejorMesaIndex + 1}`] as number[];
          }
          
          // Si ya se seleccionó un array de mesas, utiliza ese para realizar los cambios
          if (arrayMesasSeleccionado !== null) {
            //console.log(arrayMesasSeleccionado)
            const comensalesSeleccionados = parseInt(reserva.comensales);
            //arrayMesasSeleccionado = arrayMesasSeleccionado.filter(elemento => elemento !== comensalesSeleccionados);
            console.log("Comensales --> "+comensalesSeleccionados)
            console.log("Mejor mesa 1 --> "+mejorMesa)
            const index = mejorMesa.indexOf(comensalesSeleccionados);
            console.log("Index --> "+index)
            if (index !== -1) {
              mejorMesa.splice(index, 1);
              this.mesasIniciales = mejorMesa;
              console.log("MEjor mesa --> "+mejorMesa)
            }
            mejorMesa.splice(index,0);
            this.mesasIniciales = mejorMesa;
          }
        }
      });
    });
}*/

}
