import { Component,OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-oeuvres-en-attente',
  standalone: true,
  imports: [NgIf,NgFor
  ],
  templateUrl: './oeuvres-en-attente.component.html',
  styleUrl: './oeuvres-en-attente.component.css'
})
export class OeuvresEnAttenteComponent implements OnInit {
   oeuvresEnAttente: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadOeuvresEnAttente();
  }

  loadOeuvresEnAttente(): void {
    this.adminService.getOeuvresEnAttente().subscribe({
      next: (data) => this.oeuvresEnAttente = data,
      error: (err) => console.error('Erreur:', err)
    });
  }
  approuverOeuvre(id: number): void {
    if (confirm('Voulez-vous vraiment approuver cette œuvre ?')) {
      this.adminService.approuverOeuvre(id).subscribe({
        next: () => {
          alert('Œuvre approuvée avec succès');
          this.loadOeuvresEnAttente();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de l\'approbation');
        }
      });
    }
  }

  rejeterOeuvre(id: number): void {
    if (confirm('Voulez-vous vraiment rejeter cette œuvre ?')) {
      this.adminService.rejeterOeuvre(id).subscribe({
        next: () => {
          alert('Œuvre rejetée avec succès');
          this.loadOeuvresEnAttente();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors du rejet');
        }
      });
    }
  }
}