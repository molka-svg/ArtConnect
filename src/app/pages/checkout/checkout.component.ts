import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule], // FormsModule pour ngModel
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  panier: any[] = JSON.parse(localStorage.getItem('panier') || '[]');
  totalPrice: number = 0;
  paymentMethod: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Calculer le total en tenant compte des quantités
    this.totalPrice = this.panier.reduce((total, item) => total + item.prix * item.quantite, 0);
  }

  proceedToPayment(): void {
    if (this.paymentMethod === 'online') {
      this.router.navigate(['/payment-online']);
    } else if (this.paymentMethod === 'cash') {
      this.router.navigate(['/payment-cash']);
    }
  }
}