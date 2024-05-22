import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioModel } from '../../Models/usuario.model';
import saveAs from 'file-saver';
import { HttpClient } from '@angular/common/http';
import Notiflix from 'notiflix';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  editando: boolean = false;
  usua = { password: '' };
  mostrarPassword = false;

  idUsuario: string = '';
  gmailUsuario: string = '';

  constructor(private usu: UsuarioService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) {}

  ngOnInit(): void {
    const id: any = localStorage.getItem('gmail');
    
    if (id !== 'nuevo') {
      this.usu.getUsuario(id).subscribe((resp) => {
        if (resp) {
          const primeraEntrada = Object.entries(resp)[0][0];
          this.usuario = resp as UsuarioModel; 
          this.idUsuario = primeraEntrada;
          this.gmailUsuario = id;
          this.usu.getUsuarioEspe(id,primeraEntrada).subscribe((resp) => {
            this.usuario = resp as UsuarioModel;
          })
        } else {
          console.log("No se encontró el usuario con el ID proporcionado.");
        }
      });
    } else {
      console.log("ID de usuario no válido.");
    }


  }

  actualizarDatos(){
    return this.usu.actualizarUsuario(this.usuario,this.gmailUsuario,this.idUsuario).subscribe((resp) => {
      console.log('datos actualizados correctamente')
      this.editando = !this.editando;
      this.mostrarPassword = false;
    })
  }

  toggleMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  calcularAncho(numReservas: number): string {
    const anchoMinimo = 10; // Ancho mínimo en porcentaje
    const anchoMaximo = 100; // Ancho máximo en porcentaje
    const porcentaje = Math.min((numReservas / 10) * (anchoMaximo - anchoMinimo) + anchoMinimo, anchoMaximo);
    return porcentaje+"";
  }

  toggleEdicion(): void {
    this.editando = !this.editando;
    this.usu.getUsuarioEspe(this.gmailUsuario,this.idUsuario).subscribe((resp) => {
      this.usuario = resp as UsuarioModel;
    })
  }

  cerrarSesion(){
    localStorage.removeItem('token');
    localStorage.removeItem('gmail');
    this.router.navigate(['/login']);
  }

  descargarTarjeta(){
    const numReservas =  this.usuario.numReservas;

    const pdfUrlBronce = 'assets/pdf/bronce.pdf'; 
    const pdfNameBronce = 'tarjeta-bronce.pdf'; 

    const pdfUrlPlata = 'assets/pdf/plata.pdf'; 
    const pdfNamePlata = 'tarjeta-plata.pdf'; 

    const pdfUrlOro = 'assets/pdf/oro.pdf'; 
    const pdfNameOro = 'tarjeta-oro.pdf'; 

    const pdfUrlPlatino = 'assets/pdf/platino.pdf'; 
    const pdfNamePlatino = 'tarjeta-platino.pdf'; 
    
    if(numReservas < 1){
      Notiflix.Notify.failure('No tienes ninguna tarjeta disponible');
    }else if(numReservas >= 1 && numReservas < 3){
      if(this.usuario.tarjetaBronce == false){
        this.usuario.tarjetaBronce = true;
        this.usu.actualizarUsuario(this.usuario,this.gmailUsuario,this.idUsuario).subscribe((resp) => {
          console.log('datos actualizados correctamente')
        })
        this.http.get(pdfUrlBronce, { responseType: 'blob' }).subscribe((blob) => {
          saveAs(blob, pdfNameBronce);
        }, error => {
          console.error('Error al descargar el PDF', error);
        });
      }else{
        Notiflix.Notify.failure('Ya has descargado la tarjeta bronce');
      }
    }else if(numReservas >= 3 && numReservas < 6){
      if(this.usuario.tarjetaBronce == false){
        this.usuario.tarjetaBronce = true;
        this.usu.actualizarUsuario(this.usuario,this.gmailUsuario,this.idUsuario).subscribe((resp) => {
          console.log('datos actualizados correctamente')
        })
        this.http.get(pdfUrlPlata, { responseType: 'blob' }).subscribe((blob) => {
          saveAs(blob, pdfNamePlata);
        }, error => {
          console.error('Error al descargar el PDF', error);
        });
      }else{
        Notiflix.Notify.failure('Ya has descargado la tarjeta plata');
      }
    }else if(numReservas >= 6 && numReservas < 9){
      if(this.usuario.tarjetaBronce == false){
        this.usuario.tarjetaBronce = true;
        this.usu.actualizarUsuario(this.usuario,this.gmailUsuario,this.idUsuario).subscribe((resp) => {
          console.log('datos actualizados correctamente')
        })
        this.http.get(pdfUrlOro, { responseType: 'blob' }).subscribe((blob) => {
          saveAs(blob, pdfNameOro);
        }, error => {
          console.error('Error al descargar el PDF', error);
        });
      }else{
        Notiflix.Notify.failure('Ya has descargado la tarjeta oro');
      }
    }else if(numReservas >= 9){
      if(this.usuario.tarjetaBronce == false){
        this.usuario.tarjetaBronce = true;
        this.usu.actualizarUsuario(this.usuario,this.gmailUsuario,this.idUsuario).subscribe((resp) => {
          console.log('datos actualizados correctamente')
        })
        this.http.get(pdfUrlPlatino, { responseType: 'blob' }).subscribe((blob) => {
          saveAs(blob, pdfNamePlatino);
        }, error => {
          console.error('Error al descargar el PDF', error);
        });
      }else{
        Notiflix.Notify.failure('Ya has descargado la tarjeta platino');
      }
    }
  }
}  
