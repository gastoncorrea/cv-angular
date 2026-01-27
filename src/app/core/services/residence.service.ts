import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Residencia } from 'src/app/models/residence.model';

@Injectable({
  providedIn: 'root'
})
export class ResidenceService {
  private URL_API = 'http://localhost:8080/residencia/';

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all residences from the API.
   * GET /residencia/all
   * @returns An Observable of an array of Residencia.
   */
  public getAllResidences(): Observable<Residencia[]> {
    return this.http.get<Residencia[]>(this.URL_API + 'all');
  }

  /**
   * Retrieves a single Residencia by its ID.
   * GET /residencia/find/{id}
   * @param id The ID of the residence to retrieve.
   * @returns An Observable of a single Residencia.
   */
  public getResidenceById(id: number): Observable<Residencia> {
    return this.http.get<Residencia>(this.URL_API + 'find/' + id);
  }

  /**
   * Retrieves all residence entries for a given persona ID.
   * GET /residencia/persona/{personaId}
   * @param personaId The ID of the persona.
   * @returns An Observable of an array of Residencia.
   */
  public getResidencesByPersonaId(personaId: number): Observable<Residencia[]> {
    return this.http.get<Residencia[]>(this.URL_API + 'persona/' + personaId);
  }

  /**
   * Saves a new Residencia entry to the API.
   * POST /residencia/save
   * @param residencia The residence object to save.
   * @returns An Observable of the saved Residencia.
   */
  public saveResidence(residencia: Residencia): Observable<Residencia> {
    return this.http.post<Residencia>(this.URL_API + 'save', residencia);
  }

  /**
   * Updates an existing Residencia entry by its ID.
   * PUT /residencia/update/{id}
   * @param id The ID of the residence to update.
   * @param residencia The Residencia object with updated information.
   * @returns An Observable of any (generic object on success).
   */
  public updateResidence(id: number, residencia: Residencia): Observable<any> {
    return this.http.put<any>(this.URL_API + 'update/' + id, residencia);
  }

  /**
   * Deletes a Residencia entry by its ID.
   * DELETE /residencia/delete/{id}
   * @param id The ID of the residence to delete.
   * @returns An Observable of any (generic object on success).
   */
  public deleteResidence(id: number): Observable<any> {
    return this.http.delete<any>(this.URL_API + 'delete/' + id);
  }
}
