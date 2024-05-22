import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UsuarioModel } from '../../Models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})
export class CabeceraComponent implements OnInit{
  @ViewChild('menuIcon') menuIcon!: ElementRef;
  @ViewChild('cabeceraNavegacion') cabeceraNavegacion!: ElementRef;

  
  usuario: UsuarioModel = new UsuarioModel();

  nombre: string = '';

  isMenuOpen: boolean = false;
  arrowDirection: boolean = false; 
  isLogin: boolean = false;

  activeLink: string = '';

  constructor(private router: Router,private usu: UsuarioService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeLink = this.router.url.split('/')[1] || '';
      }
    });
  }
  ngOnInit(): void {
    const id: any = localStorage.getItem('gmail');
    
    if (id !== 'nuevo') {
      this.usu.getUsuario(id).subscribe((resp) => {
        if (resp) {
          const primeraEntrada = Object.entries(resp)[0][0];
          this.usuario = resp as UsuarioModel; 
          this.usu.getUsuarioEspe(id,primeraEntrada).subscribe((resp) => {
            this.usuario = resp as UsuarioModel;
            this.nombre = this.usuario.nombre;
          })
        } else {
          console.log("No se encontró el usuario con el ID proporcionado.");
        }
      });
    } else {
      console.log("ID de usuario no válido.");
    }
    
    this.startLocalStorageListener();
  }

  intervalId: any; 

  startLocalStorageListener(): void {
    if (typeof localStorage !== 'undefined') {
      this.intervalId = setInterval(() => {
        if (typeof localStorage !== 'undefined') {
          const token = localStorage.getItem('gmail');
          this.isLogin = !!token;
        } else {
          clearInterval(this.intervalId);
          console.error('localStorage is not available');
        }
      }, 1000);
    }
  }

  toggleNav() {
    const dropdownContent = this.cabeceraNavegacion.nativeElement.querySelector('.dropdown-content');
    const navElement = this.cabeceraNavegacion.nativeElement;
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      navElement.classList.add('show');
      this.arrowDirection = false; 
    } else {
      navElement.classList.remove('show');
      dropdownContent.style.display = 'none';
      this.arrowDirection = true;
      this.isMenuOpen = false;
    }
  }

  scrollTopCabecera(){
    window.scrollTo({ top: 0});
    const navElement = this.cabeceraNavegacion.nativeElement;
    this.isMenuOpen = false;
    navElement.classList.remove('show');
    this.arrowDirection = false;
    this.cerrarMenuGaleria();
  }

  scrollTopImg(){
    window.scrollTo({ top: 0});
    const navElement = this.cabeceraNavegacion.nativeElement;
    this.isMenuOpen = false;
    navElement.classList.remove('show');
    this.arrowDirection = false;
    this.cerrarMenuGaleria();
  }

  desplegarMenu() {
    const dropdownContent = this.cabeceraNavegacion.nativeElement.querySelector('.dropdown-content');
    if (dropdownContent.style.display === 'block') {
      dropdownContent.style.display = 'none';
      this.arrowDirection = false
    } else {
      dropdownContent.style.display = 'block';
      this.arrowDirection = true
      this.isMenuOpen = true;
    }
  }

  cerrarMenuGaleria(){
    const dropdownContent = this.cabeceraNavegacion.nativeElement.querySelector('.dropdown-content');
    if (dropdownContent.style.display === 'block') {
      dropdownContent.style.display = 'none';
    }
  }
}
