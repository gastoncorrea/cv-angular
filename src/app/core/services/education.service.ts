import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Educacion, EducacionDto } from 'src/app/models/education.model';
import { Herramienta } from 'src/app/models/tools.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EducacionService {
  private URL_API = `${environment.backendUrl}/educacion`;

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all educations from the API.
   * GET /educacion/all
   * @returns An Observable of an array of EducacionDto.
   */
  public getAllEducacion(): Observable<EducacionDto[]> {
    return this.http.get<EducacionDto[]>(`${this.URL_API}/all`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single EducacionDto by its ID.
   * GET /educacion/find/{id}
   * @param id The ID of the education entry to retrieve.
   * @returns An Observable of a single EducacionDto.
   */
  public getEducacionById(id: number): Observable<EducacionDto> {
    return this.http.get<EducacionDto>(`${this.URL_API}/find/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all education entries for a given persona ID.
   * GET /educacion/persona/{personaId}
   * @param personaId The ID of the persona.
   * @returns An Observable of an array of EducacionDto.
   */
  public getEducacionByPersonaId(personaId: number): Observable<EducacionDto[]> {
    return this.http.get<EducacionDto[]>(`${this.URL_API}/persona/${personaId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Saves a new Educacion entry to the API.
   * POST /educacion/save
   * @param educacion The education object to save.
   * @returns An Observable of the saved EducacionDto.
   */
  public saveEducacion(educacion: Educacion): Observable<EducacionDto> {
    return this.http.post<EducacionDto>(`${this.URL_API}/save`, educacion).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing Educacion entry by its ID.
   * PUT /educacion/update/{id}
   * @param id The ID of the education entry to update.
   * @param educacion The Educacion object with updated information.
   * @returns An Observable of the updated EducacionDto.
   */
  public updateEducacion(id: number, educacion: Educacion): Observable<EducacionDto> {
    return this.http.put<EducacionDto>(`${this.URL_API}/update/${id}`, educacion).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes an Educacion entry by its ID.
   * DELETE /educacion/delete/{id}
   * @param id The ID of the education entry to delete.
   * @returns An Observable of a success message string.
   */
  public deleteEducacion(id: number): Observable<string> {
    return this.http.delete(`${this.URL_API}/delete/${id}`, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Uploads a logo image for an Education entry.
   * POST /educacion/{id}/logo
   * @param id The ID of the education entry.
   * @param file The image file to upload.
   * @returns An Observable of the updated EducacionDto.
   */
  public uploadEducationLogo(id: number, file: File): Observable<EducacionDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<EducacionDto>(`${this.URL_API}/${id}/logo`, formData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Adds tools to an education entry.
   * POST /educacion/herramientas
   * @param educacionId The ID of the education entry.
   * @param herramientas An array of Herramienta objects to add.
   * @returns An Observable of the updated EducacionDto.
   */
  public addHerramientasToEducacion(educacionId: number, herramientas: Herramienta[]): Observable<EducacionDto> {
    return this.http.post<EducacionDto>(`${this.URL_API}/herramientas`, { educacionId, herramientas }).pipe(
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
    console.error('Raw HttpErrorResponse:', error); // Log the raw error for debugging

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      if (error.status) {
        errorMessage = `Error del servidor: ${error.status} - ${error.statusText || ''}`;
      }
      
      // Try to parse error.error if it's a string that might be JSON
      if (typeof error.error === 'string') {
        try {
          const parsedError = JSON.parse(error.error);
          if (parsedError && parsedError.error) {
            errorMessage = `Error: ${parsedError.error}`;
          } else {
            errorMessage = `Error: ${error.error}`; // Fallback to raw string if not parsable or no 'error' field
          }
        } catch (e) {
          errorMessage = `Error: ${error.error}`; // Not JSON, use as raw string
        }
      } else if (error.error && error.error.message) {
        // If error.error is an object with a message property
        errorMessage = `Error: ${error.error.message}`;
      } else if (error.error) {
        // If error.error is an object but without a specific message
        errorMessage = `Error: ${JSON.stringify(error.error)}`;
      }
    }
    console.error('Error en EducacionService (processed):', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
