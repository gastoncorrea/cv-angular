import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  URL_API = 'http://localhost:8080/usuario/';
  constructor(private http:HttpClient) { }

  saveUsuario(usuario: Usuario):Observable<string>{
    return this.http.post<string>(this.URL_API + 'save', usuario,{ responseType: 'text' as 'json' });
 }
}
