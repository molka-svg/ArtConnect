import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuctionService } from '../../services/auction.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-auction',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.css']
})
export class CreateAuctionComponent {
  auctionForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private authService: AuthService,
    private socketService: SocketService,
    private router: Router
  ) {
    // Vérifier si l'utilisateur est connecté et est un artiste ou admin
    if (!this.authService.isLoggedIn() || !this.authService.isArtist()) {
      this.errorMessage = 'Vous devez être connecté en tant qu\'artiste ou administrateur pour créer une enchère.';
      this.router.navigate(['/login']);
    }

    this.auctionForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      image: ['', [Validators.required]],
      mise_de_depart: ['', [Validators.required, Validators.min(0.01)]],
      increment: [10, [Validators.required, Validators.min(0.01)]],
      date_debut: ['', [Validators.required]],
      date_fin: ['', [Validators.required]]
    }, { validators: this.dateValidator });

    // Écouter les nouvelles enchères via WebSocket
    this.socketService.onNouvelleEnchere((data) => {
      console.log('Nouvelle enchère créée:', data);
    });
  }

  // Validateur personnalisé pour les dates
  dateValidator(group: FormGroup) {
    const dateDebut = group.get('date_debut')?.value;
    const dateFin = group.get('date_fin')?.value;
    if (dateDebut && dateFin && new Date(dateDebut) >= new Date(dateFin)) {
      return { invalidDates: true };
    }
    return null;
  }

  onSubmit() {
    if (this.auctionForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.auctionForm.value;
    const auctionData = {
      titre: formValue.titre,
      description: formValue.description,
      image: formValue.image,
      artiste_id: this.authService.getUserId(),
      mise_de_depart: Number(formValue.mise_de_depart),
      increment: Number(formValue.increment),
      date_debut: new Date(formValue.date_debut).toISOString(),
      date_fin: new Date(formValue.date_fin).toISOString(),
      signature_validation: false
    };
    if (!auctionData.artiste_id) {
      this.errorMessage = 'Erreur: Impossible de récupérer l\'identifiant de l\'artiste. Veuillez vous reconnecter.';
      this.isSubmitting = false;
      return;
    }
    this.auctionService.creerEnchere(auctionData).subscribe({
      next: (response) => {
        this.successMessage = 'Enchère et œuvre créées avec succès!';
        this.isSubmitting = false;
        setTimeout(() => {
          this.router.navigate(['/my-auctions']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = error.error?.message || 'Erreur lors de la création de l\'enchère';
        this.isSubmitting = false;
      }
    });
  }

  get formControls() {
    return this.auctionForm.controls;
  }
}