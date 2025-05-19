import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-artwork',
  standalone: true,
  imports: [RouterLink,FormsModule],
  templateUrl: './edit-artwork.component.html',
  styleUrl: './edit-artwork.component.css'
})
export class EditArtworkComponent {
    artworkId!: number;
    artwork: any = {};
  
    constructor(
      private route: ActivatedRoute,
      private artworkService: ArtworkService,
      private router:Router
    ) {}
  
    ngOnInit(): void {
      this.artworkId = +this.route.snapshot.paramMap.get('id')!;
      this.artworkService.getArtworkById(this.artworkId).subscribe(
        (artwork) => {
          this.artwork = artwork;  
        },
        (error) => {
          console.error('Error loading artwork for edit:', error);
        }
      );
    }
  
    onSubmit() {
      this.artworkService.updateArtwork(this.artworkId, this.artwork).subscribe({
        next: res => console.log('Œuvre mise à jour', res),
        error: err => console.error(err)
      });
    }
  
    saveChanges() {
      Swal.fire({
        title: 'Confirmer les modifications',
        text: "Êtes-vous sûr de vouloir enregistrer ces modifications ?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, enregistrer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          this.artworkService.updateArtwork(this.artworkId, this.artwork).subscribe(
            (response) => {
              Swal.fire({
                title: 'Succès!',
                text: 'Votre œuvre a été mise à jour avec succès.',
                icon: 'success',
                timer: 1500, 
                showConfirmButton: false
              }).then(() => {
                this.router.navigate(['/mes-oeuvres']);
              });
            },
            (error) => {
              Swal.fire({
                title: 'Erreur!',
                text: 'Une erreur est survenue lors de la mise à jour.',
                icon: 'error'
              });
              console.error('Error saving artwork:', error);
            }
          );
        }
      });
    }
  }