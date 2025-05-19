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

  minDate: string;
  dateError: boolean = false;

  constructor(
    private evenementService: EvenementService,
    private router: Router
  ) {
    // Définir la date minimale comme aujourd'hui
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  checkDate() {
    if (this.evenement.date_evt) {
      const selectedDate = new Date(this.evenement.date_evt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      this.dateError = selectedDate < today;
    }
  }

  onSubmit() {
    if (this.dateError) {
      return;
    }
    
    this.evenementService.ajouterEvenement(this.evenement).subscribe({
      next: res => {
        alert('Événement ajouté avec succès !');
        this.router.navigate(['/artiste/mes-evenements']);
      },
      error: err => console.error(err)
    });
  }
}