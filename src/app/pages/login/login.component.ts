import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RouterLink,Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = {
    mail: '',
    password: ''
  };

  constructor(private userService: UserService,private router: Router) {}
  login() {
    console.log("🔐 Tentative de connexion avec :", this.user);
    this.userService.login(this.user).subscribe({
      next: (res: any) => {
        alert('✅ Connexion réussie !');
  
        localStorage.setItem('token', res.token);
  
        if (res.user.role === 'artiste') {
          this.router.navigate(['mes-oeuvres']);
        } else if(res.user.role === 'admin'){
          this.router.navigate(['admin/oeuvres-en-attente']);

        }
        else {
          this.router.navigate(['/home']);
        }
  
        console.log(res);
      },
      error: (err) => {
        alert('❌ Erreur de connexion');
        console.error(err);
      }
    });
  }
  
}
