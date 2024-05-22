import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  @Input() rating: number = 0; // Valoración inicial
  @Input() starCount: number = 5; // Número total de estrellas
  @Output() ratingUpdated = new EventEmitter<number>(); // Evento para emitir la nueva valoración

  stars: boolean[] = [];

  constructor() {
    this.stars = Array(this.starCount).fill(false);
  }

  ngOnInit() {
    this.updateStars(this.rating);
  }

  updateStars(rating: number) {
    this.stars = this.stars.map((_, index) => index < rating);
  }

  onClick(rating: number) {
    this.rating = rating;
    this.updateStars(rating);
    this.ratingUpdated.emit(this.rating);
  }
}
