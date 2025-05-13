import { Component } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule,HttpClientModule,RouterModule,NgIf,NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'projetArt';
  constructor(public authService:AuthService){}
  logout(){
    this.authService.logout();
    window.location.href='/login';
  }
}
