import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { UsuarioModel } from '../../Models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  constructor(private usu: UsuarioService){
  }

  scrollTopCabecera(){
    window.scrollTo({ top: 0});
  }
}
