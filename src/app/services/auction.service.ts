import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private apiUrl = 'http://localhost:3000/api/enchere';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  creerEnchere(enchereData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, enchereData, { headers: this.getHeaders() });
  }

  placerMise(miseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mise`, miseData, { headers: this.getHeaders() });
  }

  getEncheresByArtiste(artisteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/artiste/${artisteId}`, { headers: this.getHeaders() });
  }

  getEncheresActives(): Observable<any> {
    return this.http.get(`${this.apiUrl}/actives`, { headers: this.getHeaders() });
  }

  getEnchereDetails(enchereId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${enchereId}`, { headers: this.getHeaders() });
  }

  getMisesByEnchere(enchereId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${enchereId}/mises`, { headers: this.getHeaders() });
  }
}