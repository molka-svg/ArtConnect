import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OeuvreService } from '../../services/oeuvre.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  oeuvres: any[] = [];
  oeuvresFiltrees: any[] = [];
  panier: any[] = JSON.parse(localStorage.getItem('panier') || '[]');
  typeFiltre: string = '';
  prixMax: number | null = null;
  nomFiltre: string = '';
  artisteFiltre: string = '';

  constructor(private oeuvreService: OeuvreService) {}

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
        : true; // Utilise artiste_nom
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
    alert('Œuvre ajoutée au panier !');
  }

  voirDetails(oeuvre: any): void {
    alert(
      `Détails de l'œuvre :\nTitre: ${oeuvre.titre}\nArtiste: ${oeuvre.artiste_nom}\nDescription: ${oeuvre.description}`
    ); // Utilise artiste_nom
  }
}