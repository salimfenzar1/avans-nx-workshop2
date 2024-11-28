import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserCredentials, IUserIdentity } from '@avans-nx-workshop/shared/api';
import { environment } from '@avans-nx-workshop/shared/util-env';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.dataApiUrl}/auth`;
  private readonly tokenKey = 'authToken';
  private userSubject = new BehaviorSubject<{ name: string; profileImgUrl: string; user_id: string } | null>(null);

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      this.updateUserFromToken(token); // Initialiseer de gebruiker direct bij opstarten
    }
  }

  login(credentials: IUserCredentials): Observable<IUserIdentity> {
    return new Observable((observer) => {
      this.http.post<IUserIdentity>(`${this.apiUrl}/login`, credentials).subscribe({
        next: (response: any) => {
          const token = response.results?.token;
          if (token) {
            this.setToken(token);
            this.updateUserFromToken(token); // Update de gebruikerstoestand direct na login
            observer.next(response);
          } else {
            console.error('Geen token ontvangen in de respons');
            observer.error('No token in response');
          }
        },
        error: (err) => {
          console.error('Login fout:', err);
          observer.error(err);
        },
      });
    });
  }

  register(user: IUserCredentials): Observable<IUserIdentity> {
    return this.http.post<IUserIdentity>(`${this.apiUrl}/register`, user);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

   getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null); // Reset de user state
  }

  getLoggedInUserId(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.user_id || null;
      } catch (error) {
        console.error('Fout bij het decoderen van het token:', error);
        return null;
      }
    }
    return null;
  }

  getLoggedInUser(): { name: string; profileImgUrl: string; user_id: string } | null {
    return this.userSubject.value;
  }

  getUserObservable(): Observable<{ name: string; profileImgUrl: string; user_id: string } | null> {
    return this.userSubject.asObservable();
  }

  private updateUserFromToken(token: string): void {
    try {
      const decoded: any = jwtDecode(token);
      const user = {
        name: decoded.name || 'Onbekend',
        profileImgUrl: decoded.profileImgUrl || '../../../../assets/recipelogo.png',
        user_id: decoded.user_id || '',
      };
      this.userSubject.next(user);
    } catch (error) {
      console.error('Fout bij het decoderen van het token:', error);
      this.userSubject.next(null);
    }
  }
}
