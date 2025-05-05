import { Component,OnInit } from '@angular/core';
import { ArtworkService } from '../../services/artwork.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-view-artwork',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './view-artwork.component.html',
  styleUrl: './view-artwork.component.css'
})
export class ViewArtworkComponent 
implements OnInit {
  artworks :any= [];

  constructor(private artworkService: ArtworkService, private router: Router) {}

  ngOnInit(): void {
    this.loadArtworks();
  }

  loadArtworks() {
    this.artworkService. getMyArtworks().subscribe(
      artworks => {
        this.artworks = artworks;
      },
      error => {
        console.error('Error loading artworks:', error);
      }
    );
  }

  editArtwork(id: number) {
    this.router.navigate([`/edit-artwork/${id}`]);
  }

  deleteArtwork(id: number) {
    const confirmDelete=window.confirm('etes-vous sur de vouloir supprimer cette oeuvre ?');
    if (confirmDelete){
    this.artworkService.deleteArtwork(id).subscribe(
      response => {
        this.loadArtworks();
      }
    ,
      error => {
        console.error('Error deleting artwork:', error);
      }
    );}
    else{
      console.log('suppression annulée')
    }
  }

}
