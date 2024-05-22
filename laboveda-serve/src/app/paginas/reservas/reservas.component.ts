import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { ReservasService } from '../../services/reservas.service';
import { ReservaModel } from '../../Models/reserva.model';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Notiflix from 'notiflix';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit{

  reservas: ReservaModel[] = [];
  cargando = false;
    
  constructor(private reservasService: ReservasService,
              private auth: AuthService,
              private router: Router,
              private httpclient:HttpClient){

  }

  ngOnInit(){
    this.enviarCorreoAutomatico();
    this.borrarReservasAntiguias();
    if(!this.auth.userToken){
      this.router.navigateByUrl('/login')
    }

    this.cargando = true;

    this.seleccionarFecha(this.seleccionarReservas)
  }

  salir(){
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  seleccionarReservas: string = 'Todas';

  seleccionarFecha(fecha: Date|string|Event){
    this.cargando = true;
    if(fecha == this.seleccionarReservas){
      this.reservasService.getReservas()
      .subscribe(resp => {
        this.reservas = resp
        this.cargando = false;
      })
    }else if(this.seleccionarReservas == 'Todas'){
      this.reservasService.getReservas()
      .subscribe(resp => {
        this.reservas = resp
        this.cargando = false;
      })
    }else{
      this.reservas = [];
      this.reservasService.getReservas()
      .subscribe(resp => {
        resp.forEach(reserva => {
          if(reserva.diaReserva.toString() == this.seleccionarReservas){
            this.reservas.push(reserva);
            this.cargando = false;
          }
        });
      })
      this.cargando = false;
    }
  }

  verTodas(){
    this.cargando = true;
  
    this.reservasService.getReservas()
      .subscribe(resp => {
        this.reservas = resp
        this.cargando = false;
      })

    this.seleccionarReservas = '';
  }

  private borrarReservasAntiguias(){

    console.log('borrando reservas antiguas')
    
    const fechaActual = new Date();

    this.reservasService.getReservas()
      .subscribe(resp => {
        resp.forEach((reserva, index) => {
          const fechaReserva = new Date(reserva.diaReserva);
          const diferenciaMeses = this.calcularDiferenciaMeses(fechaActual, fechaReserva);
          if (diferenciaMeses >= 1) {
            this.borrarReservas(reserva,index)
          }
        });
      })

  }

  calcularDiferenciaMeses(fechaActual: Date, fechaReserva: Date): number {
    const diferenciaMilisegundos = fechaActual.getTime() - fechaReserva.getTime();
    const diferenciaMeses = diferenciaMilisegundos / (1000 * 3600 * 24 * 30);
    return Math.floor(diferenciaMeses);
  }

  borrarReservas( reserva: ReservaModel, i: number ) {
    this.reservas.splice(i, 1);
    this.reservasService.borrarReserva( reserva.id ).subscribe(resp => {
      console.log('se han eliminado todas las reservas que tienen un mes de antiguedad')
    });
  }

  borrarReserva( reserva: ReservaModel, i: number ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar la reserva de ${ reserva.nombre }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        this.reservas.splice(i, 1);
        this.reservasService.borrarReserva( reserva.id ).subscribe(resp => {
          Swal.fire({
            title: 'Reserva eliminada',
            text: `La reserva de ${reserva.nombre} ${reserva.apellido} se borró correctamente`,
            icon: 'success'
          })
        });
      }

    });
  
  }

  enviarCorreoAutomatico() {
    const fechaActual = new Date();

    this.reservasService.getReservas()
      .subscribe(resp => {
        resp.forEach((reserva, index) => {
          const fechaReserva = new Date(reserva.diaReserva);
          const diferenciaDias = this.calcularDiferenciaDias(fechaActual, fechaReserva);
          if (diferenciaDias === 1) {
            let params = {
              email: reserva.gmail,
              nombre: reserva.nombre,
              apellido: reserva.apellido,
              hora: reserva.horaResrva,
              comensales: reserva.comensales
            };
            console.log('enviando correos automáticos');
            this.httpclient.post('http://localhost:3000/envioAutomatico', params).subscribe(resp => {
              console.log(resp);
            });
          }
        });
      });
  }

  calcularDiferenciaDias(fecha1: any, fecha2:any) {
    const unDia = 1000 * 60 * 60 * 24;
    const diferenciaTiempo = Math.abs(fecha1 - fecha2);
    return Math.floor(diferenciaTiempo / unDia);
  }

  
  
}
