import { Component,OnInit } from '@angular/core';
import { EvenementService } from '../../services/evenement.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';



@Component({
  selector: 'app-list-evenement',
  standalone: true,
  imports: [NgIf,NgFor,RouterLink],
  templateUrl: './list-evenement.component.html',
  styleUrl: './list-evenement.component.css'
})
export class ListEvenementComponent implements OnInit {
  evenements: any[] = [];
constructor(private service: EvenementService, private router: Router) {}
 ngOnInit(): void {
   this.loadEvenements();
 }
  loadEvenements() {
    this.service.getMesEvenements().subscribe(
      (evenements) => {
        this.evenements = evenements;
      },
      (error) => {
        console.error('Erreur lors du chargement des événements:', error);
      }
    );
  }
 editEvenement(id: number) {
    this.router.navigate([`/update-evenement/${id}`]);
  }
    deleteEvenement(id: number) {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?');
    if (confirmDelete) {
      this.service.supprimerEvenement(id).subscribe(
        (response) => {
          this.loadEvenements();
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'événement:', error);
        }
      );
    } else {
      console.log('Suppression annulée');
    }
  }
}
