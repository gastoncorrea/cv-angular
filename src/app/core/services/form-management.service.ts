import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormManagementService {
  // Almacena el identificador del formulario abierto actualmente
  private openFormId = new BehaviorSubject<string | null>(null);

  constructor() { }

  /**
   * Registra la apertura de un formulario.
   * @param formId Identificador único para el formulario (ej: 'project-add', 'edu-tool-1')
   */
  openForm(formId: string): void {
    this.openFormId.next(formId);
  }

  /**
   * Cierra todos los formularios registrados.
   */
  closeAll(): void {
    this.openFormId.next(null);
  }

  /**
   * Observable para que los componentes escuchen qué formulario debe estar abierto.
   */
  getOpenFormId(): Observable<string | null> {
    return this.openFormId.asObservable();
  }
}
