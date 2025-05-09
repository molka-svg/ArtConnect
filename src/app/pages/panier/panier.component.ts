import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css'],
})
export class PanierComponent implements OnInit {
  panier: any[] = JSON.parse(localStorage.getItem('panier') || '[]');

  constructor() {}

  ngOnInit(): void {}

  supprimerDuPanier(index: number): void {
    this.panier.splice(index, 1);
    localStorage.setItem('panier', JSON.stringify(this.panier));
  }
}