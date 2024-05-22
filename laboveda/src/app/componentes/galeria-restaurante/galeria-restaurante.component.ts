import { Component } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-galeria-restaurante',
  templateUrl: './galeria-restaurante.component.html',
  styleUrl: './galeria-restaurante.component.css'
})
export class GaleriaRestauranteComponent {
  images = [
    'assets/img/img-instalaciones/barra2.jpg',
    'assets/img/img-instalaciones/terraza2.jpg'
  ];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    if (typeof document !== 'undefined') {
      const swiper = new Swiper('.swiper', {
        loop: true
      });

      swiper.slideNext();
    }
  }

  onSlideNext(){
    // Tu lógica para el slide siguiente
  }

  onSlidePrev(){
    // Tu lógica para el slide previo
  }
}
