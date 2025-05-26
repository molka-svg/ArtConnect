import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../../services/auction.service';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {
  encheres: any[] = [];
  isLoading = true;
  now = new Date();

  constructor(private auctionService: AuctionService) {}

  ngOnInit(): void {
    this.auctionService.getEncheresActives().subscribe(
      (data) => {
        this.encheres = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur:', error);
        this.isLoading = false;
      }
    );

    // Mettre à jour l'heure actuelle chaque minute pour rafraîchir les états
    setInterval(() => {
      this.now = new Date();
    }, 60000);
  }

  isAuctionActive(startDateString: string, endDateString: string): boolean {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    return this.now >= startDate && this.now < endDate;
  }

  isAuctionComingSoon(startDateString: string): boolean {
    const startDate = new Date(startDateString);
    return this.now < startDate;
  }

  getAuctionStatus(startDateString: string, endDateString: string): string {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (this.now < startDate) {
      return 'À venir';
    } else if (this.now >= startDate && this.now < endDate) {
      return 'En cours';
    } else {
      return 'Terminée';
    }
  }

  timeUntilStart(startDateString: string): string {
    const startDate = new Date(startDateString);
    const diff = startDate.getTime() - this.now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}j ${hours}h ${minutes}m`;
  }

  timeUntilEnd(endDateString: string): string {
    const endDate = new Date(endDateString);
    const diff = endDate.getTime() - this.now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}j ${hours}h ${minutes}m`;
  }
}