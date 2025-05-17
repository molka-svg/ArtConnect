import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-payment-cash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-cash.component.html',
  styleUrls: ['./payment-cash.component.css'],
})
export class PaymentCashComponent {
  paymentData = {
    cin: '',
    phone: '',
    address: '',
  };
  panier: any[] = [];
  total: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.loadPanier();
  }

  loadPanier(): void {
    this.panier = JSON.parse(localStorage.getItem('panier') || '[]');
    this.total = this.panier.reduce((sum, item) => sum + Number(item.prix) * item.quantite, 0);
  }

  submitPayment(): void {
    if (this.panier.length === 0) {
      alert('Votre panier est vide.');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      alert('Erreur : Utilisateur non connecté');
      this.router.navigate(['/login']);
      return;
    }

    const orderData = {
      userCin: this.paymentData.cin,
      total: this.total,
      address: this.paymentData.address,
      phone: this.paymentData.phone,
      panier: this.panier.map(item => ({
        id: item.oeuvre_id, // Correspond à artwork_id dans order_items
        prix: Number(item.prix),
        quantite: item.quantite
      })),
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post('http://localhost:3000/api/payment/cash', orderData, { headers })
      .subscribe({
        next: (response: any) => {
          alert(response.message);
          localStorage.removeItem('panier');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Erreur:', error);
          alert('Erreur lors de la commande : ' + (error.error.message || 'Erreur inconnue'));
        },
      });
  }
}