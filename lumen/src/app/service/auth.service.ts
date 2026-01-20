import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User,
  TokenRefreshRequest,
  TokenRefreshResponse
} from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenRefreshTimeout: any;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
    
    if (storedUser) {
      this.startTokenRefreshTimer();
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem('access_token');
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, loginRequest)
      .pipe(
        map(response => {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          
          this.currentUserSubject.next(response.user);
          this.startTokenRefreshTimer();
          
          return response;
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/`, registerRequest)
      .pipe(
        map(response => {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          
          this.currentUserSubject.next(response.user);
          this.startTokenRefreshTimer();
          
          return response;
        }),
        catchError(error => {
          console.error('Register error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout/`, { refresh: refreshToken })
        .pipe(
          catchError(error => {
            console.error('Logout error:', error);
            return throwError(() => error);
          })
        )
        .subscribe();
    }
    
    this.clearAuthData();
  }

  refreshToken(): Observable<TokenRefreshResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      this.clearAuthData();
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.http.post<TokenRefreshResponse>(`${this.apiUrl}/token/refresh/`, {
      refresh: refreshToken
    }).pipe(
      map(response => {
        localStorage.setItem('access_token', response.access);
        this.startTokenRefreshTimer();
        return response;
      }),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentUser');
    
    this.currentUserSubject.next(null);
    
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }
  }

  private startTokenRefreshTimer(): void {
    const refreshTime = 55 * 60 * 1000;
    
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }
    
    this.tokenRefreshTimeout = setTimeout(() => {
      this.refreshToken().subscribe({
        next: () => {
          console.log('Token refreshed successfully');
        },
        error: (error) => {
          console.error('Failed to refresh token:', error);
          this.clearAuthData();
        }
      });
    }, refreshTime);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!this.token;
  }
}