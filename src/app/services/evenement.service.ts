import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private apiUrl = 'http://localhost:3000/api/evenements'; // adapte si besoin

  constructor(private http: HttpClient) {}

  ajouterEvenement(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  getMesEvenements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mes-evenements`);
  }

  getAllEvenements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getEvenementById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/evenement/${id}`);
  }

  modifierEvenement(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${id}`, data);
  }

  supprimerEvenement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
