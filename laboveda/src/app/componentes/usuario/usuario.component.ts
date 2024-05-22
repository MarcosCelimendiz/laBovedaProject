import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioModel } from '../../Models/usuario.model';

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
              private router: Router) {}

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
}  
