import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Herramienta, HerramientaDto } from 'src/app/models/tools.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HerramientaService {
  private URL_API = `${environment.backendUrl}/herramienta`;

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all herramientas from the API.
   * GET /herramienta/all
   * @returns An Observable of an array of HerramientaDto.
   */
  public getAllHerramientas(): Observable<HerramientaDto[]> {
    return this.http.get<HerramientaDto[]>(`${this.URL_API}/all`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single HerramientaDto by its ID.
   * GET /herramienta/find/{id}
   * @param id The ID of the herramienta to retrieve.
   * @returns An Observable of a single HerramientaDto.
   */
  public getHerramientaById(id: number): Observable<HerramientaDto> {
    return this.http.get<HerramientaDto>(`${this.URL_API}/find/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Saves a new Herramienta entry to the API.
   * POST /herramienta/save
   * @param herramienta The herramienta object to save.
   * @returns An Observable of the saved HerramientaDto.
   */
  public saveHerramienta(herramienta: Herramienta): Observable<HerramientaDto> {
    return this.http.post<HerramientaDto>(`${this.URL_API}/save`, herramienta).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing Herramienta entry by its ID.
   * PUT /herramienta/update/{id}
   * @param id The ID of the herramienta to update.
   * @param herramienta The Herramienta object with updated information.
   * @returns An Observable of the updated HerramientaDto.
   */
  public updateHerramienta(id: number, herramienta: Herramienta): Observable<HerramientaDto> {
    return this.http.put<HerramientaDto>(`${this.URL_API}/update/${id}`, herramienta).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a Herramienta entry by its ID.
   * DELETE /herramienta/delete/{id}
   * @param id The ID of the herramienta to delete.
   * @returns An Observable of a success message string.
   */
  public deleteHerramienta(id: number): Observable<string> {
    return this.http.delete(`${this.URL_API}/delete/${id}`, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Uploads a logo image for a Herramienta.
   * POST /herramienta/{id}/logo
   * @param id The ID of the tool.
   * @param file The image file to upload.
   * @returns An Observable of the updated HerramientaDto.
   */
  public uploadToolLogo(id: number, file: File): Observable<HerramientaDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<HerramientaDto>(`${this.URL_API}/${id}/logo`, formData).pipe(
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
    console.error('Error en HerramientaService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
