import { Component } from '@angular/core';
import { ArtworkService } from '../../services/artwork.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-artwork',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-artwork.component.html',
  styleUrl: './add-artwork.component.css'
})
export class AddArtworkComponent {
  artwork = {
    titre: '',
    description: '',
    prix: 0,
    type: '',
    image: '',
  
  };

  constructor(private artworkService: ArtworkService,private router:Router ) {
  }
  onSubmit() {
    this.artworkService.addArtwork(this.artwork).subscribe({
      next: res => {alert('Votre œuvre a été ajoutée avec succès. Elle sera publiée après l\'approbation de l\'administrateur.')
        this.router.navigate(['/mes-oeuvres'])
      },
      error: err => console.error(err)
    });
  }
}