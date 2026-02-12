import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Residencia, ResidenciaDto } from 'src/app/models/residence.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResidenceService {
  private URL_API = `${environment.backendUrl}/residencia`;

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all residences from the API.
   * GET /residencia/all
   * @returns An Observable of an array of ResidenciaDto.
   */
  public getAllResidences(): Observable<ResidenciaDto[]> {
    return this.http.get<ResidenciaDto[]>(`${this.URL_API}/all`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single ResidenciaDto by its ID.
   * GET /residencia/find/{id}
   * @param id The ID of the residence to retrieve.
   * @returns An Observable of a single ResidenciaDto.
   */
  public getResidenceById(id: number): Observable<ResidenciaDto> {
    return this.http.get<ResidenciaDto>(`${this.URL_API}/find/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all residence entries for a given persona ID.
   * GET /residencia/persona/{personaId}
   * @param personaId The ID of the persona.
   * @returns An Observable of an array of ResidenciaDto.
   */
  public getResidencesByPersonaId(personaId: number): Observable<ResidenciaDto[]> {
    return this.http.get<ResidenciaDto[]>(`${this.URL_API}/persona/${personaId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Saves a new Residencia entry to the API.
   * POST /residencia/save
   * @param residencia The residence object to save.
   * @returns An Observable of the saved ResidenciaDto.
   */
  public saveResidence(residencia: Residencia): Observable<ResidenciaDto> {
    return this.http.post<ResidenciaDto>(`${this.URL_API}/save`, residencia).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing Residencia entry by its ID.
   * PUT /residencia/update/{id}
   * @param id The ID of the residence to update.
   * @param residencia The Residencia object with updated information.
   * @returns An Observable of the updated ResidenciaDto.
   */
  public updateResidence(id: number, residencia: Residencia): Observable<ResidenciaDto> {
    return this.http.put<ResidenciaDto>(`${this.URL_API}/update/${id}`, residencia).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a Residencia entry by its ID.
   * DELETE /residencia/delete/{id}
   * @param id The ID of the residence to delete.
   * @returns An Observable of a success message string.
   */
  public deleteResidence(id: number): Observable<string> {
    return this.http.delete(`${this.URL_API}/delete/${id}`, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
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
    console.error('Error en ResidenceService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
