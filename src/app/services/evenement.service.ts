import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  private apiUrl = 'http://localhost:3000/api/evenements';

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

  ajouterEvenement(evenement: any): Observable<any> {
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
    return this.http.post(`${this.apiUrl}/add`, evenement, { headers }).pipe(
      catchError(error => {
        console.error('Erreur serveur:', error);
        if (error.status === 401) {
          alert('Token invalide ou expiré. Veuillez vous reconnecter.');
        }
        return throwError(error);
      })
    );
  }

  getMesEvenements(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/mes-evenements`, { headers }).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des événements:', error);
        return throwError(error);
      })
    );
  }

// evenement.service.ts
getAllEvenements(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
    catchError(error => {
      console.error('Error fetching events:', error);
      let errorMessage = 'Failed to fetch events';
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 500) {
        errorMessage = 'Server error occurred';
      }
      
      return throwError(() => new Error(errorMessage));
    })
  );
}

  getEvenementById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

modifierEvenement(id: number, data: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.put(`${this.apiUrl}/edit/${id}`, data, { headers }).pipe(
    catchError(error => {
      console.error('Détails erreur:', error);
      let errorMessage = 'Erreur lors de la modification';
      
      if (error.status === 403) {
        errorMessage = 'Action non autorisée';
      } else if (error.status === 404) {
        errorMessage = 'Événement non trouvé';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }

      return throwError(() => new Error(errorMessage));
    })
  );
}

  supprimerEvenement(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('Erreur suppression événement:', error);
        return throwError(error);
      })
    );
  }
}