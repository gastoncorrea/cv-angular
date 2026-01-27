import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Herramienta } from 'src/app/models/tools.model';

@Injectable({
  providedIn: 'root'
})
export class HerramientaService {
  private URL_API = 'http://localhost:8080/herramienta/';

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all herramientas from the API.
   * GET /herramienta/all
   * @returns An Observable of an array of Herramienta.
   */
  public getAllHerramientas(): Observable<Herramienta[]> {
    return this.http.get<Herramienta[]>(this.URL_API + 'all');
  }

  /**
   * Retrieves a single Herramienta by its ID.
   * GET /herramienta/find/{id}
   * @param id The ID of the herramienta to retrieve.
   * @returns An Observable of a single Herramienta.
   */
  public getHerramientaById(id: number): Observable<Herramienta> {
    return this.http.get<Herramienta>(this.URL_API + 'find/' + id);
  }

  /**
   * Saves a new Herramienta entry to the API.
   * POST /herramienta/save
   * @param herramienta The herramienta object to save.
   * @returns An Observable of the saved Herramienta.
   */
  public saveHerramienta(herramienta: Herramienta): Observable<Herramienta> {
    return this.http.post<Herramienta>(this.URL_API + 'save', herramienta);
  }

  /**
   * Updates an existing Herramienta entry by its ID.
   * PUT /herramienta/update/{id}
   * @param id The ID of the herramienta to update.
   * @param herramienta The Herramienta object with updated information.
   * @returns An Observable of any (generic object on success).
   */
  public updateHerramienta(id: number, herramienta: Herramienta): Observable<any> {
    return this.http.put<any>(this.URL_API + 'update/' + id, herramienta);
  }

  /**
   * Deletes a Herramienta entry by its ID.
   * DELETE /herramienta/delete/{id}
   * @param id The ID of the herramienta to delete.
   * @returns An Observable of any (generic object on success).
   */
  public deleteHerramienta(id: number): Observable<any> {
    return this.http.delete<any>(this.URL_API + 'delete/' + id);
  }
}
