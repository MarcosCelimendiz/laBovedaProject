import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../Models/usuario.model';
import { map } from 'rxjs';

// Interfaz para representar la estructura de la respuesta del servidor
interface AuthResponse {
  idToken: string;
  // otras propiedades que puedan estar presentes en la respuesta del servidor
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url  =`https://identitytoolkit.googleapis.com/v1/accounts:`;
  private apiKey = 'AIzaSyDjtUBSm-3_VHt6luVS1_BfTrbgfGiivic';

  userToken: string|null = '';

  constructor(private http: HttpClient) { 
    if (typeof localStorage !== 'undefined') {
      this.leerToken();
    }
  }

  logout(){
    localStorage.removeItem('token')
  }

  login(usuario: UsuarioModel){
    const authData = {
      ...usuario,
      returnSecureToken: true
    }

    return this.http.post<AuthResponse>(
      `${this.url}signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(
      map(resp => {
        console.log('entro en el mapa del rxjs')
        this.guardarToken(resp.idToken,usuario); 
        return resp;
      })
    )
  }
  
  nuevoUsuario(usuario: UsuarioModel){
    const authData = {
      ...usuario,
      returnSecureToken: true
    }

    return this.http.post<AuthResponse>(
      `${this.url}signUp?key=${this.apiKey}`,
      authData
    ).pipe(
      map(resp => {
        console.log('entro en el mapa del rxjs')
        this.guardarToken(resp.idToken,usuario); 
        return resp;
      })
    )
  }

  private guardarToken(idToken:string, usuario: UsuarioModel){
    const idUsuario = usuario.email.replace(".", ""); 
    this.userToken = idToken
    localStorage.setItem('gmail',idUsuario)
    localStorage.setItem('token',idToken)
  }

  private leerToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token')
    }else{
      this.userToken = '';
    }
  }
}
