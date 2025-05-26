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
formatDateTime(dateString: string): string {
  if (!dateString) return 'Non spécifié';
  
  const date = new Date(dateString);
  
  // Options de formatage
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  return date.toLocaleDateString('fr-FR', options);
}

// Modifiez aussi timeUntilStart et timeUntilEnd pour un meilleur affichage
timeUntilStart(startDateString: string): string {
  const startDate = new Date(startDateString);
  const diff = startDate.getTime() - this.now.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days} jour${days > 1 ? 's' : ''} ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} heure${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}

timeUntilEnd(endDateString: string): string {
  const endDate = new Date(endDateString);
  const diff = endDate.getTime() - this.now.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days} jour${days > 1 ? 's' : ''} ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} heure${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}
}