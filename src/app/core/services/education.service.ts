import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Educacion } from 'src/app/models/education.model';
import { Herramienta } from 'src/app/models/tools.model';

@Injectable({
  providedIn: 'root'
})
export class EducacionService {
  private URL_API = 'http://localhost:8080/educacion/';

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all educations from the API.
   * GET /educacion/all
   * @returns An Observable of an array of Educacion.
   */
  public getAllEducacion(): Observable<Educacion[]> {
    return this.http.get<Educacion[]>(this.URL_API + 'all');
  }

  /**
   * Retrieves a single Educacion by its ID.
   * GET /educacion/find/{id}
   * @param id The ID of the education entry to retrieve.
   * @returns An Observable of a single Educacion.
   */
  public getEducacionById(id: number): Observable<Educacion> {
    return this.http.get<Educacion>(this.URL_API + 'find/' + id);
  }

  /**
   * Retrieves all education entries for a given persona ID.
   * GET /educacion/persona/{personaId}
   * @param personaId The ID of the persona.
   * @returns An Observable of an array of Educacion.
   */
  public getEducacionByPersonaId(personaId: number): Observable<Educacion[]> {
    return this.http.get<Educacion[]>(this.URL_API + 'persona/' + personaId);
  }

  /**
   * Saves a new Educacion entry to the API.
   * POST /educacion/save
   * @param educacion The education object to save.
   * @returns An Observable of the saved Educacion.
   */
  public saveEducacion(educacion: Educacion): Observable<Educacion> {
    return this.http.post<Educacion>(this.URL_API + 'save', educacion);
  }

  /**
   * Updates an existing Educacion entry by its ID.
   * PUT /educacion/update/{id}
   * @param id The ID of the education entry to update.
   * @param educacion The Educacion object with updated information.
   * @returns An Observable of any (generic object on success).
   */
  public updateEducacion(id: number, educacion: Educacion): Observable<any> {
    return this.http.put<any>(this.URL_API + 'update/' + id, educacion);
  }

  /**
   * Deletes an Educacion entry by its ID.
   * DELETE /educacion/delete/{id}
   * @param id The ID of the education entry to delete.
   * @returns An Observable of any (generic object on success).
   */
  public deleteEducacion(id: number): Observable<any> {
    return this.http.delete<any>(this.URL_API + 'delete/' + id);
  }

  /**
   * Adds tools to an education entry.
   * POST /educacion/herramientas
   * @param educacionId The ID of the education entry.
   * @param herramientas An array of Herramienta objects to add.
   * @returns An Observable of any (generic object on success).
   */
  public addHerramientasToEducacion(educacionId: number, herramientas: Herramienta[]): Observable<any> {
    return this.http.post<any>(this.URL_API + 'herramientas', { educacionId, herramientas });
  }
}
