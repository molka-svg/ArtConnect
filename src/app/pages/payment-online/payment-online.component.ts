import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-payment-online',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-online.component.html',
  styleUrls: ['./payment-online.component.css'],
})
export class PaymentOnlineComponent {
  paymentData = {
    cin: '',
    cardType: '',
    phone: '',
    cardNumber: '',
  };
  panier: any[] = JSON.parse(localStorage.getItem('panier') || '[]');

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  submitPayment(): void {
  const token = this.authService.getToken();
  if (!token) {
    alert('Erreur : Utilisateur non connecté');
    this.router.navigate(['/login']);
    return;
  }

  const total = this.panier.reduce((sum, item) => sum + item.prix * item.quantite, 0);
  const orderData = {
    userCin: this.paymentData.cin,
    total,
    panier: this.panier,
    cardType: this.paymentData.cardType,
    phone: this.paymentData.phone,
    cardNumber: this.paymentData.cardNumber,
  };

  console.log('Panier avant envoi:', JSON.stringify(this.panier, null, 2));
  console.log('orderData:', JSON.stringify(orderData, null, 2));

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.http
    .post('http://localhost:3000/api/payment/online', orderData, { headers })
    .subscribe({
      next: (response: any) => {
        alert(response.message);
        localStorage.removeItem('panier');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        const errorMessage = error.error?.message || error.message || 'Erreur inconnue lors du paiement';
        alert('Erreur lors du paiement : ' + errorMessage);
        console.error('Erreur HTTP:', error);
      },
    });
}
}