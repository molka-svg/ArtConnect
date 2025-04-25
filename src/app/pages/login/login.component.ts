import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = {
    mail: '',
    password: ''
  };

  constructor(private userService: UserService) {}

  login() {
    console.log("🔐 Tentative de connexion avec :", this.user);
    this.userService.login(this.user).subscribe({
      next: (res) => {
        alert('✅ Connexion réussie !');
        console.log(res);
      },
      error: (err) => {
        alert('❌ Erreur de connexion');
        console.error(err);
      }
    });
  }
}
