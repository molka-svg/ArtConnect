import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private baseUrl = 'http://localhost:3000/api/oeuvres'; 

  constructor(private http: HttpClient) {}
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');  
    if (!token) {
      throw new Error('Token manquant');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
  }
  addArtwork(artwork: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token manquant');
      alert('Token manquant. Veuillez vous reconnecter.');
      return throwError('Token manquant'); 
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    console.log('Token envoyé:', token); 
  
    return this.http.post(`${this.baseUrl}/add`, artwork, { headers }).pipe(
      catchError(error => {
        console.error('Erreur serveur:', error);
        if (error.status === 401) {
          alert('Token invalide ou expiré. Veuillez vous reconnecter.');
        }
        return throwError(error);
      })
    );
  }
  
  getMyArtworks(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/mes-oeuvres`, { headers }).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des œuvres :', error);
        return throwError(error);
      })
    );
  }
  

  getArtworks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/view`);
  }

  getArtworkById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/edit-artwork/${id}`);
  }
  
  deleteArtwork(id: number): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('Erreur suppression backend:', error);
        return throwError(error);
      })
    );
  }
  

   updateArtwork(id: number, artwork: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, artwork);
  }
  
}
