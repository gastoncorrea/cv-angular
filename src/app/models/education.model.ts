import { Herramienta } from './tools.model';

export interface Educacion {
    id_educacion?: number;
    nombre_institucion: string;
    logo_imagen: string;
    fecha_inicio: string;
    fecha_fin: string;
    titulo: string;
    url_titulo: string;
    persona?: { id_persona: number };
    herramientas?: Herramienta[];
}

export interface EducacionDto {
    id_educacion?: number;
    nombre_institucion: string;
    logo_imagen: string;
    fecha_inicio: string;
    fecha_fin: string;
    titulo: string;
    url_titulo: string;
    herramientas?: Herramienta[];
}