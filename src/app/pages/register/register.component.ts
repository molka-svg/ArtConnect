import { Component, NgModule } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { RouterLink,Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterLink,NgIf,NgFor],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
 user = {
    nom: '',
    prenom: '',
    telephone: '',
    mail: '',
    password: '',
    role: 'user',
    gender: 'female',
    date_naissance: ''
  };
  // Dans votre composant
acceptTerms: boolean = false;
showTerms: boolean = false;
  confirmPassword = '';
  errorMessage = '';
  ageValid = true;

  constructor(private userService: UserService, private router: Router) {}

  checkAge() {
    if (this.user.date_naissance) {
      const birthDate = new Date(this.user.date_naissance);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      this.ageValid = age >= 16;
      if (!this.ageValid) {
        this.errorMessage = 'Vous devez avoir au moins 16 ans et au maximum 80 ans pour vous inscrire';
      } else {
        this.errorMessage = '';
      }
    }
  }

  register() {
    // Check age again before submitting
    this.checkAge();
    
    if (!this.ageValid) {
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = "❗ Les mots de passe ne correspondent pas.";
      return;
    }

    if (!this.isPasswordValid(this.user.password)) {
      this.errorMessage = "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre";
      return;
    }

    this.userService.register(this.user).subscribe({
      next: (res) => {
        alert('✅ Inscription réussie ! Vous pouvez maintenant vous connecter.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || '❌ Erreur lors de l\'inscription';
        console.error(err);
      }
    });
  }
  private isPasswordValid(password: string): boolean {
  return true;
    
  }
}