import { Component,OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-evenements-en-attente',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './evenements-en-attente.component.html',
  styleUrl: './evenements-en-attente.component.css'
})
export class EvenementsEnAttenteComponent implements OnInit {
  evenementsEnAttente: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadEvenementsEnAttente();
  }

  loadEvenementsEnAttente(): void {
    this.adminService.getEvenementsEnAttente().subscribe({
      next: (data) => this.evenementsEnAttente = data,
      error: (err) => console.error('Erreur:', err)
    });
  }

  approuverEvenement(id: number): void {
    if (confirm('Voulez-vous vraiment approuver cet événement ?')) {
      this.adminService.approuverEvenement(id).subscribe({
        next: () => {
          alert('Événement approuvé avec succès');
          this.loadEvenementsEnAttente();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'approbation');
        }
      });
    }
  }

  rejeterEvenement(id: number): void {
    if (confirm('Voulez-vous vraiment rejeter cet événement ?')) {
      this.adminService.rejeterEvenement(id).subscribe({
        next: () => {
          alert('Événement rejeté avec succès');
          this.loadEvenementsEnAttente();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors du rejet');
        }
      });
    }
  }

}
