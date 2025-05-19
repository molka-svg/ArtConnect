import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RouterLink,Router } from '@angular/router';
import { MatSnackBar,MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = {
    mail: '',
    password: ''
  };

  constructor(private userService: UserService,private router: Router
    ,
    private snackBar: MatSnackBar
  ) {}
    login() {
    console.log("🔐 Tentative de connexion avec :", this.user);
    this.userService.login(this.user).subscribe({
      next: (res: any) => {
        this.snackBar.open('Connexion réussie !', 'Fermer', {
          duration: 3000, 
          panelClass: ['snackbar-success']
        });

        localStorage.setItem('token', res.token);

        if (res.user.role === 'artiste') {
          this.router.navigate(['mes-oeuvres']);
        } else if (res.user.role === 'admin') {
          this.router.navigate(['admin/oeuvres-en-attente']);
        } else {
          this.router.navigate(['/home']);
        }
        console.log(res);
      },
      error: (err) => {
        this.snackBar.open('Mot De passe ou email incorrecte', 'Réessayer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        console.error(err);
      }
    });
  }

}
