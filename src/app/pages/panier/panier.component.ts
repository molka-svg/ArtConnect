import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css'],
})
export class PanierComponent implements OnInit {
  panier: any[] = [];
  total: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadPanier();
  }

  loadPanier(): void {
    this.panier = JSON.parse(localStorage.getItem('panier') || '[]');
    this.calculerTotal();
  }

  calculerTotal(): void {
    this.total = this.panier.reduce((sum, item) => sum + Number(item.prix) * item.quantite, 0);
  }

  supprimerDuPanier(index: number): void {
    this.panier.splice(index, 1);
    localStorage.setItem('panier', JSON.stringify(this.panier));
    this.calculerTotal();
  }

  startCheckout(): void {
    const isLoggedIn = !!localStorage.getItem('token');
    if (isLoggedIn) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}