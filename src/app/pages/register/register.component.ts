import { Component, NgModule } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { RouterLink,Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterLink],
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
  confirmPassword = ''; 
constructor(private userService:UserService,private router:Router){}
register() {
  if (this.user.password !== this.confirmPassword) {
    alert("❗ Les mots de passe ne correspondent pas.");
    return;
  }

  this.userService.register(this.user).subscribe({
    next: (res) => {
      alert('✅ Utilisateur créé avec succès !');
      this.router.navigate(['/login']);
      console.log(res);
    },
    error: (err) => {
      alert('❌ Erreur lors de l’inscription');
      console.error(err);
    }
  });
}
}
