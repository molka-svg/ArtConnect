import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private apiUrl = 'http://localhost:3000/api/enchere';

  constructor(private http: HttpClient) {}

  creerEnchere(enchereData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, enchereData);
  }

  getEncheresByArtiste(artisteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/artiste/${artisteId}`);
  }

  getEncheresActives(): Observable<any> {
    return this.http.get(`${this.apiUrl}/actives`);
  }

  getEnchereDetails(enchereId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${enchereId}`);
  }

  getMisesByEnchere(enchereId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${enchereId}/mises`);
  }

  placerMise(miseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mise`, miseData);
  }
}