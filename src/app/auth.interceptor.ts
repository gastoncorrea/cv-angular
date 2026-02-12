import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Import AuthService
import { Router } from '@angular/router'; // Import Router

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {} // Inject AuthService and Router

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getAccessToken(); // Get the token from AuthService

    // If we have a token, clone the request and add the Authorization header
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Si el token es inválido, expiró, o no tiene permisos (403),
          // el backend devuelve un error. Aquí manejamos el logout automático.
          this.authService.logout();
          alert('Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión de nuevo.'); // Display message
          this.router.navigate(['/']); // Redirect to public home page
        }
        return throwError(() => error);
      })
    );
  }
}
