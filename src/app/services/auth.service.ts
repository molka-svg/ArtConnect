import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
 getRole(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token); 
    return decoded.role;
  } catch (error) {
    console.error('Erreur de décodage du token', error);
    return null;
  }
}

  isArtist(): boolean {
    return this.getRole() === 'artiste';
  }
  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  logout(): void {
    localStorage.removeItem('token');
  }
     getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token); 
      return decoded.id; 
    } catch (error) {
      console.error('Erreur de décodage du token', error);
      return null;
    }
  }
}
