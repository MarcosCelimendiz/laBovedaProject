import { AfterContentInit, Component, OnInit } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-galeria-platos',
  templateUrl: './galeria-platos.component.html',
  styleUrl: './galeria-platos.component.css'
})
export class GaleriaPlatosComponent {
  images = [
    'assets/img/img-platos/cachopo3.jpg',
    'assets/img/img-platos/trufa.jpg',
    'assets/img/img-platos/crep.jpg',
    'assets/img/img-platos/vino.jpg',
    'assets/img/img-platos/cachopo2.jpg',
    'assets/img/img-platos/cocktail.jpg'
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
