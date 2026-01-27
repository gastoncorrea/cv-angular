import { Contacto } from './contact.model';
import { Educacion } from './education.model';
import { Proyecto } from './project.model';
import { Residencia } from './residence.model';
import { UsuarioApi } from './usuario-api.model'; // Full user object

export interface Persona {
    id_persona?: number;
    nombre: string;
    apellido: string;
    imagenUrl?: string;
    descripcion_mi: string;
    fecha_nacimiento: string; // "string (date)" in OpenAPI
    num_celular: string; // "string (pattern: ...)" in OpenAPI
    usuario?: UsuarioApi; // Full user object as per OpenAPI
    residencia?: Residencia[]; // Array of Residencia
    estudios?: Educacion[]; // Array of Educacion
    proyectos?: Proyecto[]; // Array of Proyecto
    contacto?: Contacto[]; // Array of Contacto
}

// PersonaDto for PUT operations
export interface PersonaDto {
    id_persona?: number;
    nombre: string;
    apellido: string;
    imagenUrl?: string;
    descripcion_mi: string;
    fecha_nacimiento: string;
    num_celular: string;
    residencias?: Residencia[]; // Note: OpenAPI uses "residencias" here, not "residencia"
    contactos?: Contacto[]; // Note: OpenAPI uses "contactos" here, not "contacto"
}