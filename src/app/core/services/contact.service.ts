import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contacto } from 'src/app/models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private URL_API = 'http://localhost:8080/contacto/'; // Assuming this is the base URL for contact endpoints

  constructor(private http: HttpClient) { }

  /**
   * Retrieves contacts for a specific persona.
   * GET /persona/{personaId}/contactos
   * (Assuming this endpoint structure based on other services)
   * @param personaId The ID of the persona.
   * @returns An Observable of an array of Contacto.
   */
  public getContactsByPersonaId(personaId: number): Observable<Contacto[]> {
    return this.http.get<Contacto[]>(`http://localhost:8080/persona/${personaId}/contactos`);
  }

  /**
   * Saves a new Contacto to the API.
   * POST /contacto/save
   * @param contact The contact object to save.
   * @returns An Observable of the saved Contacto.
   */
  public saveContact(contact: Contacto): Observable<Contacto> {
    return this.http.post<Contacto>(this.URL_API + 'save', contact);
  }

  /**
   * Updates an existing Contacto by its ID.
   * PUT /contacto/update/{id}
   * @param id The ID of the contact to update.
   * @param contact The updated contact object.
   * @returns An Observable of the updated Contacto.
   */
  public updateContact(id: number, contact: Contacto): Observable<Contacto> {
    return this.http.put<Contacto>(this.URL_API + 'update/' + id, contact);
  }

  /**
   * Deletes a Contacto by its ID.
   * DELETE /contacto/delete/{id}
   * @param id The ID of the contact to delete.
   * @returns An Observable of any (generic object on success).
   */
  public deleteContact(id: number): Observable<any> {
    return this.http.delete(this.URL_API + 'delete/' + id, { responseType: 'text' });
  }

  /**
   * Uploads a logo image for a Contact.
   * POST /contacto/{id}/logo
   * @param id The ID of the contact.
   * @param file The image file to upload.
   * @returns An Observable of any (generic object on success).
   */
  public updateContactImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.URL_API}${id}/logo`, formData);
  }
}
