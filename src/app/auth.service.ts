import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.backendUrl;

  // BehaviorSubject para gestionar el estado de login del usuario
  private loggedIn = new BehaviorSubject<boolean>(this.hasTokens());

  constructor(private http: HttpClient) { }

  // --- Métodos de Gestión de Tokens ---

  private saveTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    this.loggedIn.next(true); // Actualiza el estado de login
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.loggedIn.next(false); // Actualiza el estado de login
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  public isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private hasTokens(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  // --- Métodos de API (Registro y Login) ---

  // Método para registrar un nuevo usuario
  // El backend espera un objeto Usuario en JSON
  register(user: { email: string; nombre: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/usuario/save`, user, { headers }).pipe(
      tap((response) => console.log('Registro exitoso:', response)),
      catchError(this.handleError)
    );
  }

  // Método para iniciar sesión
  // El backend espera un formulario URL-Encoded
  login(credentials: { email: string; password: string }): Observable<any> {
    const body = new HttpParams()
      .set('email', credentials.email)
      .set('password', credentials.password);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post<AuthTokens>(`${this.apiUrl}/login`, body.toString(), { headers }).pipe(
      tap((tokens: AuthTokens) => {
        this.saveTokens(tokens);
        console.log('Login exitoso. Tokens guardados:', tokens);
      }),
      catchError(this.handleError)
    );
  }

  // Método para cerrar sesión
  logout(): void {
    this.clearTokens();
    // Opcional: navegar a la página de login
  }

  /**
   * Centralized error handling for HTTP requests.
   * @param error The HttpErrorResponse object.
   * @returns An Observable that re-throws a user-friendly error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status) {
        errorMessage = `Error del servidor: ${error.status} - ${error.statusText || ''}`;
      }
      if (error.error && typeof error.error === 'string') {
        errorMessage = `Error: ${error.error}`;
      } else if (error.error && error.error.message) {
        errorMessage = `Error: ${error.error.message}`;
      }
    }
    console.error('Error en AuthService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
