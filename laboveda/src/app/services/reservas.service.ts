import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReservaModel } from '../Models/reserva.model';

import {map, delay} from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private url = 'https://reservas-laboveda-default-rtdb.firebaseio.com';

  constructor(private http:HttpClient) { }

  crearReserva(reserva: ReservaModel){
    
    return this.http.post(`${this.url}/reservas.json`,reserva)
      .pipe(
        map((resp: any)=>{
          reserva.id = resp.name;
          return reserva;
        })
      );

  }

  actualizarReserva(reserva:ReservaModel){

    const reservaTemp = {
      ...reserva,
      id:null
    };

    return this.http.put(`${this.url}/reservas/${reserva.id}.json`,reservaTemp);
      
  }

  getReserva(id:string){
    return this.http.get(`${this.url}/reservas/${id}.json`)
  }

  getReservas() {
    return this.http.get(`${this.url}/reservas.json`)
      .pipe(
        map((reservasObj: any) => this.crearArray(reservasObj))
      );
  }

  private crearArray(reservasObj: any): ReservaModel[] {
    const reservas: ReservaModel[] = [];

    if (!reservasObj || typeof reservasObj !== 'object') {
      return reservas;
    }

    Object.keys(reservasObj).forEach(key => {
      const reserva: ReservaModel = reservasObj[key];
      reserva.id = key;
      reservas.push(reserva);
    });

    return reservas;
  }

  borrarReserva(id:string){
    return this.http.delete(`${this.url}/reservas/${id}.json`);
  }


}

