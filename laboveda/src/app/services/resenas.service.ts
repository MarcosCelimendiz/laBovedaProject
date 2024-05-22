import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResenaModel } from '../Models/resena.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResenasService {

  private url = 'https://reservas-laboveda-default-rtdb.firebaseio.com';

  constructor(private http:HttpClient) { }

  crearResena(resena: ResenaModel){

    console.log(resena)
    
    return this.http.post(`${this.url}/resenas.json`,resena)
      .pipe(
        map((resp: any)=>{
          resena.id = resp.name;
          return resena;
        })
      );

  }

  getResenas() {
    return this.http.get(`${this.url}/resenas.json`)
      .pipe(
        map((resenasObj: any) => this.crearArray(resenasObj))
      );
  }

  private crearArray(resenasObj: any): ResenaModel[] {
    const resenas: ResenaModel[] = [];

    if (!resenasObj || typeof resenasObj !== 'object') {
      return resenas;
    }

    Object.keys(resenasObj).forEach(key => {
      const resena: ResenaModel = resenasObj[key];
      resena.id = key;
      resenas.push(resena);
    });

    return resenas;
  }
}
