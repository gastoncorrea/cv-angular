import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Contacto, ContactoDto } from 'src/app/models/contact.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private URL_API = `${environment.backendUrl}/contacto`;

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all contacts from the API.
   * GET /contacto/all
   * @returns An Observable of an array of ContactoDto.
   */
  public getAllContacts(): Observable<ContactoDto[]> {
    return this.http.get<ContactoDto[]>(`${this.URL_API}/all`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single ContactoDto by its ID.
   * GET /contacto/find/{id}
   * @param id The ID of the contact to retrieve.
   * @returns An Observable of a single ContactoDto.
   */
  public getContactById(id: number): Observable<ContactoDto> {
    return this.http.get<ContactoDto>(`${this.URL_API}/find/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves contacts for a specific persona.
   * GET /contacto/persona/{personaId}
   * @param personaId The ID of the persona.
   * @returns An Observable of an array of ContactoDto.
   */
  public getContactsByPersonaId(personaId: number): Observable<ContactoDto[]> {
    return this.http.get<ContactoDto[]>(`${this.URL_API}/persona/${personaId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Saves a new Contacto to the API.
   * POST /contacto/save
   * @param contact The contact object to save.
   * @returns An Observable of the saved ContactoDto.
   */
  public saveContact(contact: Contacto): Observable<ContactoDto> {
    return this.http.post<ContactoDto>(`${this.URL_API}/save`, contact).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing Contacto by its ID.
   * PUT /contacto/update/{id}
   * @param id The ID of the contact to update.
   * @param contact The updated contact object.
   * @returns An Observable of the updated ContactoDto.
   */
  public updateContact(id: number, contact: Contacto): Observable<ContactoDto> {
    return this.http.put<ContactoDto>(`${this.URL_API}/update/${id}`, contact).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a Contacto by its ID.
   * DELETE /contacto/delete/{id}
   * @param id The ID of the contact to delete.
   * @returns An Observable of a success message string.
   */
  public deleteContact(id: number): Observable<string> {
    return this.http.delete(`${this.URL_API}/delete/${id}`, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Uploads a logo image for a Contact.
   * POST /contacto/{id}/logo
   * @param id The ID of the contact.
   * @param file The image file to upload.
   * @returns An Observable of the updated ContactoDto.
   */
  public uploadContactLogo(id: number, file: File): Observable<ContactoDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ContactoDto>(`${this.URL_API}/${id}/logo`, formData).pipe(
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
    console.error('Error en ContactService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
