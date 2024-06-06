import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //private baseUrl = 'http://25.77.202.144:8080/wolfram';
  private baseUrl = 'http://localhost:8080/wolfram'; // URL вашего Spring сервера
  constructor(private http: HttpClient) {}

  isUserLoggedIn(): boolean {
    return !!sessionStorage.getItem('email');
    // return true;
  }

  signOut() {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
  }

  registerUser(userDetails: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/registration`, userDetails, {
      responseType: 'text',
    });
  }

  loginUser(userDetails: User): Observable<any> {
    return this.http.post<User>(`${this.baseUrl}/login`, userDetails).pipe(
      tap((user) => {
        // Сохраняем email и username пользователя после успешного входа
        sessionStorage.setItem('email', user.email);
        sessionStorage.setItem('username', user.username);
      })
    );
  }
  getLoggedInUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/loggedInUsers`);
  }
  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`);
  }
}
