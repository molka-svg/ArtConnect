import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvenementService } from '../../services/evenement.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-evenement',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './edit-evenement.component.html',
  styleUrl: './edit-evenement.component.css'
})
export class EditEvenementComponent implements OnInit {
  evenementId: number = 0;
  evenement: any = {
    titre: '',
    description: '',
    date_evt: '',
    heure: '',
    lieu: '',
    prix_ticket: 0,
    nombre_places: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evenementService: EvenementService
  ) {}

  ngOnInit(): void {
    this.evenementId = +this.route.snapshot.params['id'];
    this.evenementService.getEvenementById(this.evenementId).subscribe({
      next: (data) => this.evenement = data,
      error: (err) => console.error('Erreur de chargement de l\'événement', err)
    });
  }

  updateEvenement() {
    this.evenementService.modifierEvenement(this.evenementId, this.evenement).subscribe({
      next: () => {
        alert('Événement mis à jour avec succès');
        this.router.navigate(['/artist/list-evenement']);
      },
      error: (err) => console.error('Erreur de mise à jour', err)
    });
  }
}