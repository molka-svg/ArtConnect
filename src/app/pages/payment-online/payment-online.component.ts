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
    phone: '',
    cardType: '',
    cardNumber: '',
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

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s+/g, '');
    if (value.length > 0) {
      value = value.match(/.{1,4}/g)!.join(' ');
      if (value.length > 19) value = value.substring(0, 19);
      input.value = value;
    }
  }

  getCardTypeClass(): string {
    const cardType = this.paymentData.cardType;
    if (cardType === 'visa' || cardType === 'mastercard' || cardType === 'amex') {
      return `card-type-icon ${cardType}`;
    }
    return 'card-type-icon';
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
      cardType: this.paymentData.cardType,
      phone: this.paymentData.phone,
      cardNumber: this.paymentData.cardNumber.replace(/\s+/g, ''), // Enlever les espaces
      panier: this.panier.map(item => ({
        id: item.oeuvre_id,
        prix: Number(item.prix),
        quantite: item.quantite
      })),
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi...';

    this.http
      .post('http://localhost:3000/api/payment/online', orderData, { headers })
      .subscribe({
        next: (response: any) => {
          alert(response.message);
          localStorage.removeItem('panier');
          this.router.navigate(['/home']);
          submitButton.disabled = false;
          submitButton.textContent = 'Payer maintenant';
        },
        error: (error) => {
          console.error('Erreur:', error);
          alert('Erreur lors de la commande : ' + (error.error.message || 'Erreur inconnue'));
          submitButton.disabled = false;
          submitButton.textContent = 'Payer maintenant';
        },
      });
  }
}