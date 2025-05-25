import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-oeuvres-en-attente',
  standalone: true,
  imports: [NgIf, NgFor],
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
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment approuver cette œuvre ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, approuver',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.approuverOeuvre(id).subscribe({
          next: () => {
            Swal.fire('Succès', 'Œuvre approuvée avec succès', 'success');
            this.loadOeuvresEnAttente();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Erreur', 'Erreur lors de l\'approbation', 'error');
          }
        });
      }
    });
  }

  rejeterOeuvre(id: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment rejeter cette œuvre ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, rejeter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.rejeterOeuvre(id).subscribe({
          next: () => {
            Swal.fire('Succès', 'Œuvre rejetée avec succès', 'success');
            this.loadOeuvresEnAttente();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Erreur', 'Erreur lors du rejet', 'error');
          }
        });
      }
    });
  }
}