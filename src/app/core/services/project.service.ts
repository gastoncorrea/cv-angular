import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Proyecto, ProyectoDto } from 'src/app/models/project.model';
import { Herramienta } from 'src/app/models/tools.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private URL_API = `${environment.backendUrl}/proyecto`;

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all projects from the API.
   * GET /proyecto/all
   * @returns An Observable of an array of ProyectoDto.
   */
  public getAllProyectos(): Observable<ProyectoDto[]> {
    return this.http.get<ProyectoDto[]>(`${this.URL_API}/all`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single ProyectoDto by its ID.
   * GET /proyecto/find/{id}
   * @param id The ID of the project to retrieve.
   * @returns An Observable of a single ProyectoDto.
   */
  public getProyectoById(id: number): Observable<ProyectoDto> {
    return this.http.get<ProyectoDto>(`${this.URL_API}/find/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves all projects for a given persona ID.
   * GET /proyecto/persona/{personaId}
   * @param personaId The ID of the persona.
   * @returns An Observable of an array of ProyectoDto.
   */
  public getProyectoByPersonaId(personaId: number): Observable<ProyectoDto[]> {
    return this.http.get<ProyectoDto[]>(`${this.URL_API}/persona/${personaId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Saves a new Proyecto entry to the API.
   * POST /proyecto/save
   * @param proyecto The project object to save.
   * @returns An Observable of the saved ProyectoDto.
   */
  public saveProyecto(proyecto: Proyecto): Observable<ProyectoDto> {
    return this.http.post<ProyectoDto>(`${this.URL_API}/save`, proyecto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing Proyecto entry by its ID.
   * PUT /proyecto/update/{id}
   * @param id The ID of the project to update.
   * @param proyecto The Proyecto object with updated information.
   * @returns An Observable of the updated ProyectoDto.
   */
  public updateProyecto(id: number, proyecto: Proyecto): Observable<ProyectoDto> {
    return this.http.put<ProyectoDto>(`${this.URL_API}/update/${id}`, proyecto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a Proyecto entry by its ID.
   * DELETE /proyecto/delete/{id}
   * @param id The ID of the project to delete.
   * @returns An Observable of a success message string.
   */
  public deleteProyecto(id: number): Observable<string> {
    return this.http.delete(`${this.URL_API}/delete/${id}`, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Adds tools to a project.
   * POST /proyecto/{id}/herramientas
   * @param proyectoId The ID of the project.
   * @param herramientas An array of Herramienta objects to add.
   * @returns An Observable of the updated ProyectoDto.
   */
  public addHerramientasToProyecto(proyectoId: number, herramientas: Herramienta[]): Observable<ProyectoDto> {
    return this.http.post<ProyectoDto>(`${this.URL_API}/${proyectoId}/herramientas`, herramientas).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Uploads a logo image for a Proyecto.
   * POST /proyecto/{id}/logo
   * @param id The ID of the project.
   * @param file The image file to upload.
   * @returns An Observable of the updated ProyectoDto.
   */
  public uploadProjectLogo(id: number, file: File): Observable<ProyectoDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ProyectoDto>(`${this.URL_API}/${id}/logo`, formData).pipe(
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
    console.error('Error en ProyectoService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
