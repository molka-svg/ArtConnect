import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel } from '@angular/forms';
import { EvenementService } from '../../services/evenement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-evenement',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-evenement.component.html',
  styleUrl: './add-evenement.component.css'
})
export class AddEvenementComponent {
 evenement = {
    titre: '',
    description: '',
    date_evt: '',
    heure: '',
    lieu: '',
    prix_ticket: 0,
    nombre_places: 0,
  };

  constructor(private evenementService: EvenementService, private router: Router) {}

  onSubmit() {
    this.evenementService.ajouterEvenement(this.evenement).subscribe({
      next: (res) => {
        alert('Événement ajouté avec succès !');
        this.router.navigate(['/artist/list-evenement']); 
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de l\'événement:', err);
      }
    });
  }
}