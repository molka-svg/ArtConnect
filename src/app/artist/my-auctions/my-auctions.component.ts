import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../../services/auction.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-my-auctions',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './my-auctions.component.html',
  styleUrl: './my-auctions.component.css'
})
export class MyAuctionsComponent implements OnInit {
  encheres: any[] = [];
  isLoading = true;

  constructor(
    private auctionService: AuctionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const artisteId = this.authService.getUserId();
    if (artisteId && this.authService.isArtist()) {
      this.auctionService.getEncheresByArtiste(artisteId).subscribe({
        next: (data) => {
          this.encheres = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }
}