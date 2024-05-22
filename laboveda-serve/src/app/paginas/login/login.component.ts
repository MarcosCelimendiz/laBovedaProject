import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../Models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { log } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  recordarme: boolean = false;

  constructor(private auth: AuthService,
              private router: Router) { 
    if (typeof localStorage !== 'undefined') {
      // Código que accede a localStorage
      // Por ejemplo:
      localStorage.setItem('token', 'miToken');
    }
  }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        this.usuario.email = storedEmail;
        this.recordarme = true;
      }else{
        console.log('no se ha guardado')
      }
      localStorage.setItem('token', 'miToken');
    }
  }


  login(form:NgForm){

    if(form.invalid){return;}

    Swal.fire({
      allowOutsideClick:false,
      text: 'Espere por favor...',
      icon: 'info'
    })
    Swal.showLoading();

    this.auth.login(this.usuario)
      .subscribe( resp => {
        console.log(resp)
        Swal.close();
        if(this.recordarme){
          localStorage.setItem('email',this.usuario.email)
        }
        this.router.navigateByUrl('/reservas')
      }, (err) => {
        console.log(err.error.error.message)
        Swal.fire({
          title: 'Error al autenticar',
          icon: 'error',
          text: err.error.error.message
        })
      })

  }

}
