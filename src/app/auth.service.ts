import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // Asegúrate de que esta URL sea correcta para tu backend

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
      catchError(error => {
        console.error('Error en el registro:', error);
        return throwError(() => new Error('Error al registrar usuario'));
      })
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
      catchError(error => {
        console.error('Error en el login:', error);
        this.clearTokens(); // Asegúrate de limpiar tokens en caso de error
        return throwError(() => new Error('Credenciales inválidas o error del servidor'));
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    this.clearTokens();
    // Opcional: navegar a la página de login
  }
}
