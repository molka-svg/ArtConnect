import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtworkService } from '../../services/artwork.service';
import { OeuvreService } from '../../services/oeuvre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-artwork',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-artwork.component.html',
  styleUrl: './detail-artwork.component.css'
})
export class DetailArtworkComponent implements OnInit {
  artwork: any = {};
  artworkId!: number;
  panier: any[] = JSON.parse(localStorage.getItem('panier') || '[]');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private artworkService: ArtworkService
  ) {}

  ngOnInit(): void {
    this.artworkId = +this.route.snapshot.paramMap.get('id')!;
    this.artworkService.getArtworkById(this.artworkId).subscribe(
      (artwork) => {
        this.artwork = artwork;  
        console.log("Artwork details:", artwork);
      },
      (error) => {
        console.error('Error loading artwork for edit:', error);
      }
    );
  }
  ajouterAuPanier(oeuvre: any): void {
    const item = {
      oeuvre_id: oeuvre.oeuvre_id,
      titre: oeuvre.titre,
      prix: oeuvre.prix,
      quantite: 1,
      date_ajout: new Date().toISOString(),
    };
    this.panier.push(item);
    localStorage.setItem('panier', JSON.stringify(this.panier));
    Swal.fire({
      title: 'Succès!',
      text: 'Œuvre ajoutée au panier!',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }
  retourListe(): void {
    this.router.navigate(['/artworks']);
  }
}