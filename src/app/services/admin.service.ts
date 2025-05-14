import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
 private apiUrl = 'http://localhost:3000/api/admin';
  constructor(private http: HttpClient) { }

  getOeuvresEnAttente(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/oeuvres/en-attente`);
  }

  getEvenementsEnAttente(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/evenements/en-attente`);
  }

  approuverOeuvre(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/oeuvres/approuver/${id}`, {});
  }
    rejeterOeuvre(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/oeuvres/rejeter/${id}`, {});
  }

  approuverEvenement(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/evenements/${id}/approuver`, {});
  }
  
  rejeterEvenement(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/evenements/${id}/rejeter`, {});
  }
}
