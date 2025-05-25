import { Component,OnInit } from '@angular/core';
import { AuctionService } from '../../services/auction.service';
import { NgFor, NgIf } from '@angular/common';
import { Router,RouterLink } from '@angular/router';
@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [NgIf,NgFor,RouterLink],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css'
})
export class AuctionComponent implements OnInit {
  encheres: any[] = [];
  isLoading = true;

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
  }

}
