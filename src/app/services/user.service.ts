import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
private url='http://localhost:3000/api/users';

  constructor(private http:HttpClient) { }
  register(userData:any){
    return this.http.post(`${this.url}/register`,userData);

  }
  
  login(Login:any){
    return this.http.post(`${this.url}/login`,Login);
  }
}
