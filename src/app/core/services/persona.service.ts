import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Persona, PersonaDto } from 'src/app/models/person.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private URL_API = `${environment.backendUrl}/persona`;

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all personas from the API.
   * GET /persona/all
   * @returns An Observable of an array of PersonaDto.
   */
  public getAllPersonas(): Observable<PersonaDto[]> {
    return this.http.get<PersonaDto[]>(`${this.URL_API}/all`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single PersonaDto by their ID.
   * GET /persona/find/{id}
   * @param id The ID of the persona to retrieve.
   * @returns An Observable of a single PersonaDto.
   */
  public getPersona(id: number): Observable<PersonaDto> {
    return this.http.get<PersonaDto>(`${this.URL_API}/find/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Saves a new Persona to the API.
   * POST /persona/save
   * @param persona The persona object to save.
   * @returns An Observable of the saved PersonaDto.
   */
  public savePersona(persona: Persona): Observable<PersonaDto> {
    return this.http.post<PersonaDto>(`${this.URL_API}/save`, persona).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing Persona by their ID.
   * PUT /persona/update/{id}
   * @param id The ID of the persona to update.
   * @param personaDto The PersonaDto object with updated persona information.
   * @returns An Observable of the updated PersonaDto.
   */
  public updatePersona(id: number, personaDto: PersonaDto): Observable<PersonaDto> {
    return this.http.put<PersonaDto>(`${this.URL_API}/update/${id}`, personaDto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Uploads a profile image for a Persona.
   * POST /persona/{id}/imagen
   * @param id The ID of the persona.
   * @param file The image file to upload.
   * @returns An Observable of the updated PersonaDto.
   */
  public uploadPersonaImage(id: number, file: File): Observable<PersonaDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<PersonaDto>(`${this.URL_API}/${id}/imagen`, formData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a Persona by their ID.
   * DELETE /persona/delete/{id}
   * @param id The ID of the persona to delete.
   * @returns An Observable of a success message string.
   */
  public deletePersona(id: number): Observable<string> {
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
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      if (error.status) {
        errorMessage = `Error del servidor: ${error.status} - ${error.statusText || ''}`;
      }
      if (error.error && typeof error.error === 'string') {
        errorMessage = `Error: ${error.error}`; // Backend might send a plain string error
      } else if (error.error && error.error.message) {
        errorMessage = `Error: ${error.error.message}`; // Backend might send an object with a message
      }
    }
    console.error('Error en PersonaService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
