import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  selectedOrderId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const token = this.authService.getToken();
    console.log('Token utilisé:', token);
    if (!token) {
      alert('Veuillez vous connecter pour voir votre historique.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get('http://localhost:3000/api/orders/history', { headers }).subscribe({
      next: (response: any) => {
        console.log('Réponse API:', response);
        this.orders = response.orders || [];
      },
      error: (error) => {
        console.error('Erreur API:', error.status, error.message, error.error);
        alert(`Erreur lors de la récupération des commandes: ${error.status} - ${error.message}`);
      },
    });
  }

  viewOrderDetails(order: any): void {
    this.selectedOrderId = this.selectedOrderId === order.id ? null : order.id;
  }
}