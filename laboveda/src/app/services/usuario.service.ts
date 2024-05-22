import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../Models/usuario.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  private url = 'https://reservas-laboveda-default-rtdb.firebaseio.com';

  constructor(private http:HttpClient) { }

  crearUsuario(usuario: UsuarioModel) {
    const idUsuario = usuario.email.replace('.','');
    localStorage.setItem('gmail', idUsuario);
    return this.http.post<any>(`${this.url}/usuarios/${idUsuario}.json`, usuario)
      .pipe(
        map((resp: any) => {
          return usuario;
        })
      );
  }


  actualizarUsuario(usuario:UsuarioModel,gmail:string,id:string){

    const usuarioTemp = {
      ...usuario,
      id:null
    };

    return this.http.put(`${this.url}/usuarios/${gmail}/${id}.json`,usuarioTemp);
      
  }

  getUsuario(id:string){
    return this.http.get(`${this.url}/usuarios/${id}.json`)
  }

  getUsuarioEspe(gmail:string, id:string){
    return this.http.get(`${this.url}/usuarios/${gmail}/${id}.json`)
  }

  getUsuarios() {
    return this.http.get(`${this.url}/usuarios.json`)
      .pipe(
        map((reservasObj: any) => this.crearArray(reservasObj))
      );
  }

  private crearArray(reservasObj: any): UsuarioModel[] {
    const usuarios: UsuarioModel[] = [];

    if (!reservasObj || typeof reservasObj !== 'object') {
      return usuarios;
    }

    Object.keys(reservasObj).forEach(key => {
      const reserva: UsuarioModel = reservasObj[key];
      reserva.id = key;
      usuarios.push(reserva);
    });

    return usuarios;
  }

  borrarReserva(id:string){
    return this.http.delete(`${this.url}/reservas/${id}.json`);
  }
}
