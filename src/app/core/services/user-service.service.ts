import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol, UsuarioApi, UsuarioDto, RolToUserForm } from 'src/app/models/usuario-api.model';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private readonly API_URL = 'http://localhost:8080/usuario/';
  private readonly API_URL_ROLES = 'http://localhost:8080/usuario/rol/';


  constructor(private http: HttpClient) { }

  /**
   * Retrieves all users from the API.
   * GET /usuario/all
   * @returns An Observable of an array of UsuarioApi.
   */
  getAllUsers(): Observable<UsuarioApi[]> {
    return this.http.get<UsuarioApi[]>(this.API_URL + 'all');
  }

  /**
   * Retrieves a single user by their ID.
   * GET /usuario/find/{id}
   * @param id The ID of the user to retrieve.
   * @returns An Observable of a single UsuarioApi.
   */
  getUserById(id: number): Observable<UsuarioApi> {
    return this.http.get<UsuarioApi>(this.API_URL + 'find/' + id);
  }

  /**
   * Saves a new user to the API.
   * POST /usuario/save
   * @param usuario The user object to save.
   * @returns An Observable of the saved UsuarioApi.
   */
  saveUsuario(usuario: UsuarioApi): Observable<UsuarioApi> {
    return this.http.post<UsuarioApi>(this.API_URL + 'save', usuario);
  }

  /**
   * Updates an existing user by their ID.
   * PUT /usuario/update/{id}
   * @param id The ID of the user to update.
   * @param usuario The UsuarioDto object with updated user information.
   * @returns An Observable of any (generic object on success).
   */
  updateUser(id: number, usuario: UsuarioDto): Observable<any> {
    return this.http.put<any>(this.API_URL + 'update/' + id, usuario);
  }

  /**
   * Deletes a user by their ID.
   * DELETE /usuario/delete/{id}
   * @param id The ID of the user to delete.
   * @returns An Observable of any (generic object on success).
   */
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(this.API_URL + 'delete/' + id);
  }

  /**
   * Saves a new role to the API.
   * POST /usuario/rol/save
   * @param rol The role object to save.
   * @returns An Observable of the saved Rol.
   */
  saveRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.API_URL_ROLES + 'save', rol);
  }

  /**
   * Adds a role to a user.
   * POST /usuario/rol/addtouser
   * @param form The RolToUserForm object containing user email and role name.
   * @returns An Observable of any (generic object on success).
   */
  addRolToUser(form: RolToUserForm): Observable<any> {
    return this.http.post<any>(this.API_URL_ROLES + 'addtouser', form);
  }
}
