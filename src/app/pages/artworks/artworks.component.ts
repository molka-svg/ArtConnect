import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { OeuvreService } from '../../services/oeuvre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-artworks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './artworks.component.html',
  styleUrl: './artworks.component.css'
})
export class ArtworksComponent implements OnInit {
  oeuvres: any[] = [];
  oeuvresFiltrees: any[] = [];
  panier: any[] = JSON.parse(localStorage.getItem('panier') || '[]');
  typeFiltre: string = '';
  prixMax: number | null = null;
  nomFiltre: string = '';
  artisteFiltre: string = '';

  constructor(
    private oeuvreService: OeuvreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.oeuvreService.getAllOeuvres().subscribe((data) => {
      
      this.oeuvres = data;
      this.oeuvresFiltrees = data;
    });
  }

  appliquerFiltres(): void {
    this.oeuvresFiltrees = this.oeuvres.filter((oeuvre) => {
      const matchType = this.typeFiltre ? oeuvre.type === this.typeFiltre : true;
      const matchPrix = this.prixMax ? parseFloat(oeuvre.prix) <= this.prixMax : true;
      const matchNom = this.nomFiltre
        ? oeuvre.titre.toLowerCase().includes(this.nomFiltre.toLowerCase())
        : true;
      const matchArtiste = this.artisteFiltre
        ? oeuvre.artiste_nom.toLowerCase().includes(this.artisteFiltre.toLowerCase())
        : true;
      return matchType && matchPrix && matchNom && matchArtiste;
    });
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
participerEnchere(oeuvre: any): void {
  // Vérifier d'abord si l'enchère est active
  if (this.isEnchereActive(oeuvre.date_debut, oeuvre.date_fin)) {
    this.router.navigate(['/enchere', oeuvre.id]);
  } else {
    alert("Cette enchère n'est plus active ou n'a pas encore commencé");
  }
}

isEnchereActive(startDate: string, endDate: string): boolean {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now >= start && now < end;
}
  voirDetails(oeuvre: any) {
    this.router.navigate(['/detail-artwork', oeuvre.oeuvre_id]);
  }
}