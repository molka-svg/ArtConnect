import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auction-detail',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink,FormsModule],
  templateUrl: './auction-detail.component.html',
  styleUrl: './auction-detail.component.css'
})
export class AuctionDetailComponent implements OnInit, OnDestroy {
  enchere: any = null;
  mises: any[] = [];
  isLoading = true;
  nouvelleMise = 0;
  currentUserId: number | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private auctionService: AuctionService,
    private socketService: SocketService,
    private authService: AuthService
  ) {
    this.currentUserId = this.authService.getUserId();
  }

  ngOnInit(): void {
    const enchereId = this.route.snapshot.paramMap.get('id');
    
    if (enchereId) {
      this.auctionService.getEnchereDetails(+enchereId).subscribe({
        next: (data) => {
          this.enchere = data;
          this.loadMises(+enchereId);
          this.joinEnchere(+enchereId);
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.isLoading = false;
        }
      });
    }

    this.socketService.onMiseUpdate((data) => {
      if (data.enchere_id === +(enchereId || 0)) {
        this.mises.unshift(data);
        this.enchere.top_mise = data.montant;
      }
    });

    this.socketService.onMiseError((error) => {
      this.errorMessage = error.message;
      setTimeout(() => this.errorMessage = null, 5000);
    });
  }

  loadMises(enchereId: number): void {
    this.auctionService.getMisesByEnchere(enchereId).subscribe({
      next: (data) => {
        this.mises = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.isLoading = false;
      }
    });
  }

  joinEnchere(enchereId: number): void {
    this.socketService.joinEnchere(enchereId);
  }

  placerMise(): void {
    if (!this.currentUserId) {
      this.errorMessage = 'Vous devez être connecté pour placer une mise';
      return;
    }

    const minMise = (this.enchere.top_mise || this.enchere.mise_de_depart) + this.enchere.increment;
    
    if (this.nouvelleMise < minMise) {
      this.errorMessage = `Le montant doit être d'au moins ${minMise} €`;
      return;
    }

    const miseData = {
      enchere_id: this.enchere.enchere_id,
      utilisateur_id: this.currentUserId,
      montant: this.nouvelleMise
    };

    this.socketService.envoyerMise(miseData);
    this.nouvelleMise = 0;
  }

  ngOnDestroy(): void {
    const enchereId = this.route.snapshot.paramMap.get('id');
    if (enchereId) {
      this.socketService.leaveEnchere(+enchereId);
    }
  }
}