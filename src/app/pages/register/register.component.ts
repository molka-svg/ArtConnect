import { Component, NgModule } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
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
constructor(private userService:UserService){}
register() {
  this.userService.register(this.user).subscribe({
    next: (res) => {
      alert('✅ Utilisateur créé avec succès !');
      console.log(res);
    },
    error: (err) => {
      alert('❌ Erreur lors de l’inscription');
      console.error(err);
    }
  });
}
}
