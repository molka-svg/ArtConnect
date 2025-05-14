import { Component,OnInit } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AuthService } from './services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule,HttpClientModule,RouterModule,NgIf,NgFor
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'projetArt';
  constructor(public authService:AuthService){}
  logout(){
    this.authService.logout();
    window.location.href='/login';
  }
  ngOnInit() {
  console.log('LoggedIn:', this.authService.isLoggedIn());
  console.log('IsArtist:', this.authService.isArtist());
  console.log('Role:', this.authService.getRole());
}

}
