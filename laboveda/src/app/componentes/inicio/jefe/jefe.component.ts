import { Component } from '@angular/core';

@Component({
  selector: 'app-jefe',
  templateUrl: './jefe.component.html',
  styleUrl: './jefe.component.css'
})
export class JefeComponent {
  scrollTopCabecera(){
    window.scrollTo({ top: 0});
  }
}
