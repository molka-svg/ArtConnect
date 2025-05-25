import { Component, OnInit } from '@angular/core';
import { EvenementService } from '../../services/evenement.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit{
events:any[]=[];
 errorMessage: string = '';
constructor(private service:EvenementService){}

   ngOnInit(): void {
    this.service.getAllEvenements().subscribe({
      next: (data) => {
        this.events = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.errorMessage = 'Failed to load events. Please try again later.';
        // You could also show a user-friendly message here
      }
    });
  }
}
