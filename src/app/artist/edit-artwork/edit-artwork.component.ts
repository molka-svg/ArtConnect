import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
      if (confirm('Êtes-vous sûr de vouloir enregistrer les modifications ?')) {
        this.artworkService.updateArtwork(this.artworkId, this.artwork).subscribe(
          (response) => {
            console.log('Artwork updated:', response);
            this.router.navigate(['/mes-oeuvres']);
          },
          (error) => {
            console.error('Error saving artwork:', error);
          }
        );
      }
    }
  }