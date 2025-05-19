import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  step = 1;
  mail = '';
  code = '';
  newPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  requestResetCode(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.http.post('http://localhost:3000/api/auth/forgot-password', { mail: this.mail }).subscribe({
      next: (response: any) => {
        console.log('Réponse demande code:', response);
        this.successMessage = response.message;
        this.step = 2;
      },
      error: (error) => {
        console.error('Erreur demande code:', error);
        this.errorMessage = error.error.message || 'Erreur serveur';
      },
    });
  }

  verifyCode(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.http.post('http://localhost:3000/api/auth/verify-code', { mail: this.mail, code: this.code }).subscribe({
      next: (response: any) => {
        console.log('Réponse vérification code:', response);
        this.successMessage = response.message;
        this.step = 3;
      },
      error: (error) => {
        console.error('Erreur vérification code:', error);
        this.errorMessage = error.error.message || 'Erreur serveur';
      },
    });
  }

  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.http
      .post('http://localhost:3000/api/auth/reset-password', {
        mail: this.mail,
        code: this.code,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: (response: any) => {
          console.log('Réponse réinitialisation:', response);
          this.successMessage = response.message;
          setTimeout(() => this.router.navigate(['/login']), 2000); // Redirection après 2s
        },
        error: (error) => {
          console.error('Erreur réinitialisation:', error);
          this.errorMessage = error.error.message || 'Erreur serveur';
        },
      });
  }
}