import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OeuvreService {
  private apiUrl = 'http://localhost:3000/api/oeuvres'; // URL de ton API

  constructor(private http: HttpClient) {}

  getAllOeuvres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}