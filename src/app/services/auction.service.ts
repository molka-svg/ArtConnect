import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private apiUrl = 'http://localhost:3000/api/enchere';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token manquant');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  creerEnchere(enchereData: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Token manquant');
      alert('Token manquant. Veuillez vous reconnecter.');
      return throwError('Token manquant');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log('Token envoyé:', token);

    return this.http.post(`${this.apiUrl}/create`, enchereData, { headers }).pipe(
      catchError(error => {
        console.error('Erreur serveur:', error);
        if (error.status === 401) {
          alert('Token invalide ou expiré. Veuillez vous reconnecter.');
        }
        return throwError(error);
      })
    );
  }

  placerMise(miseData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/mise`, miseData, { headers }).pipe(
      catchError(error => {
        console.error('Erreur lors du placement de la mise:', error);
        return throwError(error);
      })
    );
  }

  getEncheresByArtiste(artisteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/artiste/${artisteId}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des enchères:', error);
        return throwError(error);
      })
    );
  }

  getEncheresActives(): Observable<any> {
    return this.http.get(`${this.apiUrl}/actives`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des enchères actives:', error);
        return throwError(error);
      })
    );
  }

  getEnchereDetails(enchereId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${enchereId}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des détails:', error);
        return throwError(error);
      })
    );
  }

  getMisesByEnchere(enchereId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${enchereId}/mises`, { headers }).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des mises:', error);
        return throwError(error);
      })
    );
  }
}