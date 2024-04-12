import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private baseUrl = 'http://localhost:8080/wolfram'; // URL вашего Spring сервера

  constructor(private http: HttpClient) { }
  
  isUserLoggedIn(): boolean {
    return !!sessionStorage.getItem('email');
  }

  signOut() {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
  }

  registerUser(userDetails: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/registration`, userDetails, {responseType: 'text'});
  }

  loginUser(userDetails: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, userDetails);
  }

  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`);
  }
}