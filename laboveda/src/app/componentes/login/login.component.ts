import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../Models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'console';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel = new UsuarioModel();
  recordarme: boolean = false;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private usu: UsuarioService) { 
    if (typeof localStorage !== 'undefined') {
    }
  }

  ngOnInit() {
    const id: any = this.route.snapshot.paramMap.get('id');
    
    if (id !== 'nuevo') {
      console.log(id)
      this.usu.getUsuario(id)
        .subscribe((resp) => {
          if (resp) {
            this.usuario = resp as UsuarioModel; 
            this.usuario.id = id;
          }
        });
    }
    
    if (typeof localStorage !== 'undefined') {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        this.usuario.email = storedEmail;
        this.recordarme = true;
      }else{
        console.log('no se ha guardado')
      }
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

    //this.usu.getUsuario();

    this.auth.login(this.usuario)
      .subscribe( resp => {
        console.log(resp)
        Swal.close();
        if(this.recordarme){
          localStorage.setItem('email',this.usuario.email)
        }
        this.router.navigateByUrl('/usuario')
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
