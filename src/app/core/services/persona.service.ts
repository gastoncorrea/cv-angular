import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona, PersonaDto } from 'src/app/models/person.model'; // Import PersonaDto

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private URL_API = 'http://localhost:8080/persona/';

  constructor(private http: HttpClient) { }

  /**
   * Retrieves all personas from the API.
   * GET /persona/all
   * @returns An Observable of an array of Persona.
   */
  public getAllPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.URL_API + 'all');
  }

  /**
   * Retrieves a single Persona by their ID.
   * GET /persona/find/{id}
   * @param id The ID of the persona to retrieve.
   * @returns An Observable of a single Persona.
   */
  public getPersona(id: number): Observable<Persona> {
    return this.http.get<Persona>(this.URL_API + 'find/' + id);
  }

  /**
   * Saves a new Persona to the API.
   * POST /persona/save
   * @param persona The persona object to save.
   * @returns An Observable of the saved Persona.
   */
  public savePersona(persona: Persona): Observable<Persona> { // Changed return type to Observable<Persona>
    return this.http.post<Persona>(this.URL_API + 'save', persona);
  }

  /**
   * Updates an existing Persona by their ID.
   * PUT /persona/update/{id}
   * @param id The ID of the persona to update.
   * @param personaDto The PersonaDto object with updated persona information.
   * @returns An Observable of any (generic object on success).
   */
  public updatePersona(id: number, personaDto: PersonaDto): Observable<any> {
    return this.http.put<any>(this.URL_API + 'update/' + id, personaDto);
  }

  /**
   * Uploads a profile image for a Persona.
   * POST /persona/{id}/imagen
   * @param id The ID of the persona.
   * @param file The image file to upload.
   * @returns An Observable of any (generic object on success).
   */
  public uploadPersonaImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(this.URL_API + id + '/imagen', formData);
  }

  /**
   * Deletes a Persona by their ID.
   * DELETE /persona/delete/{id}
   * @param id The ID of the persona to delete.
   * @returns An Observable of any (generic object on success).
   */
  public deletePersona(id: number): Observable<any> {
    return this.http.delete<any>(this.URL_API + 'delete/' + id);
  }
}
