import { AfterContentInit, Component, OnInit } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'] // Utiliza 'styleUrls' en lugar de 'styleUrl'
})
export class CarouselComponent implements OnInit, AfterContentInit {
  images = [
    'assets/img/img-instalaciones/entrada1.jpg',
    'assets/img/img-instalaciones/barra1.jpg',
  ];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    // Verificar si estamos en un entorno de navegador
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
