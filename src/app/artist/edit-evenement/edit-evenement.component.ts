import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvenementService } from '../../services/evenement.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-evenement',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './edit-evenement.component.html',
  styleUrl: './edit-evenement.component.css'
})
export class EditEvenementComponent implements OnInit {
 evenementId: number = 0;
  evenement: any = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evenementService: EvenementService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.evenementId = +params['id'];
      this.loadEvenement();
    });
  }

  loadEvenement(): void {
    this.isLoading = true;
    this.evenementService.getEvenementById(this.evenementId).subscribe({
      next: (data) => {
        this.evenement = {
          ...data,
          date_evt: this.formatDateForInput(data.date_evt),
          heure: this.formatTimeForInput(data.heure)
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement', err);
        this.isLoading = false;
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de charger l\'événement',
          icon: 'error'
        }).then(() => {
          this.router.navigate(['/artiste/mes-evenements']);
        });
      }
    });
  }

  private formatDateForInput(dateString: string): string {
    try {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  private formatTimeForInput(timeString: string): string {
    if (!timeString) return '';
    return timeString.split(':').slice(0, 2).join(':');
  }

  updateEvenement(): void {
    if (!this.evenement) return;

    Swal.fire({
      title: 'Confirmer',
      text: 'Voulez-vous vraiment modifier cet événement?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, modifier',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.evenementService.modifierEvenement(this.evenementId, this.evenement).subscribe({
          next: () => {
            Swal.fire({
              title: 'Succès!',
              text: 'Modification enregistrée',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/artiste/mes-evenements']);
            });
          },
          error: (err) => {
            this.isLoading = false;
            Swal.fire({
              title: 'Erreur',
              text: err.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
            console.error('Erreur détaillée:', err);
          }
        });
      }
    });
  }
}