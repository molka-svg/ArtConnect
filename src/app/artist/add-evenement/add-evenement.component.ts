import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel } from '@angular/forms';
import { EvenementService } from '../../services/evenement.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-evenement',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './add-evenement.component.html',
  styleUrl: './add-evenement.component.css'
})
export class AddEvenementComponent {
 evenement = {
    titre: '',
    description: '',
    date_evt: '',
    heure: '',
    type: '',
    duree: 0,
    lieu: '',
    prix_ticket: 0,
    nombre_places: 0
  };

  constructor(
    private evenementService: EvenementService,
    private router: Router
  ) {}

  onSubmit() {
    this.evenementService.ajouterEvenement(this.evenement).subscribe({
      next: res => {
        alert('Événement ajouté avec succès !');
        this.router.navigate(['/artiste/mes-evenements']);
      },
      error: err => console.error(err)
    });
  }
}