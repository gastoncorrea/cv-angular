import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto } from 'src/app/models/project.model';
import { Herramienta } from 'src/app/models/tools.model';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private URL_API = 'http://localhost:8080/proyecto/';

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all projects from the API.
   * GET /proyecto/all
   * @returns An Observable of an array of Proyecto.
   */
  public getAllProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.URL_API + 'all');
  }

  /**
   * Retrieves a single Proyecto by its ID.
   * GET /proyecto/find/{id}
   * @param id The ID of the project to retrieve.
   * @returns An Observable of a single Proyecto.
   */
  public getProyectoById(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(this.URL_API + 'find/' + id);
  }

  /**
   * Retrieves all projects for a given persona ID.
   * GET /proyecto/persona/{personaId}
   * @param personaId The ID of the persona.
   * @returns An Observable of an array of Proyecto.
   */
  public getProyectoByPersonaId(personaId: number): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.URL_API + 'persona/' + personaId);
  }

  /**
   * Saves a new Proyecto entry to the API.
   * POST /proyecto/save
   * @param proyecto The project object to save.
   * @returns An Observable of the saved Proyecto.
   */
  public saveProyecto(proyecto: Proyecto): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.URL_API + 'save', proyecto);
  }

  /**
   * Updates an existing Proyecto entry by its ID.
   * PUT /proyecto/update/{id}
   * @param id The ID of the project to update.
   * @param proyecto The Proyecto object with updated information.
   * @returns An Observable of any (generic object on success).
   */
  public updateProyecto(id: number, proyecto: Proyecto): Observable<any> {
    return this.http.put<any>(this.URL_API + 'update/' + id, proyecto);
  }

  /**
   * Deletes a Proyecto entry by its ID.
   * DELETE /proyecto/delete/{id}
   * @param id The ID of the project to delete.
   * @returns An Observable of any (generic object on success).
   */
  public deleteProyecto(id: number): Observable<any> {
    return this.http.delete<any>(this.URL_API + 'delete/' + id);
  }

  /**
   * Adds tools to a project.
   * POST /proyecto/herramientas
   * @param proyectoId The ID of the project.
   * @param herramientas An array of Herramienta objects to add.
   * @returns An Observable of any (generic object on success).
   */
  public addHerramientasToProyecto(proyectoId: number, herramientas: Herramienta[]): Observable<any> {
    return this.http.post<any>(this.URL_API + 'herramientas', { proyectoId, herramientas });
  }
}
