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
constructor(private service:EvenementService){}

  ngOnInit(): void {
    this.service.getAllEvenements().subscribe((data) => {
      this.events = data;
      console.log(data);
    });
  }
}
