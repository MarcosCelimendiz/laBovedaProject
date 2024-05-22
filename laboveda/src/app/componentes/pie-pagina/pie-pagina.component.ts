import { Component } from '@angular/core';

@Component({
  selector: 'app-pie-pagina',
  templateUrl: './pie-pagina.component.html',
  styleUrl: './pie-pagina.component.css'
})
export class PiePaginaComponent {
  
  constructor(){
    
  }


  scrollTopCabecera(){
    window.scrollTo({ top: 0});
  }
}
