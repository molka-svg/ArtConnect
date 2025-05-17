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
  panier: any[] = JSON.parse(localStorage.getItem('panier') || '[]');

  constructor(private router: Router) {}

  ngOnInit(): void {}

  supprimerDuPanier(index: number): void {
    this.panier.splice(index, 1);
    localStorage.setItem('panier', JSON.stringify(this.panier));
  }

  startCheckout(): void {
    // Vérification temporaire de l'état de connexion
    const isLoggedIn = !!localStorage.getItem('token'); // À remplacer par ton service d'authentification
    if (isLoggedIn) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}