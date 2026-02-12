import { Herramienta } from './tools.model';

export interface Proyecto {
    id_proyecto?: number;
    nombre: string;
    descripcion: string;
    url: string;
    inicio: string;
    fin: string;
    logo_proyecto?: string;
    persona?: { id_persona: number };
    herramientas?: Herramienta[];
}

export interface ProyectoDto {
    id_proyecto: number;
    nombre: string;
    descripcion: string;
    url: string;
    inicio: string;
    fin: string;
    logo_proyecto: string;
    herramientas?: Herramienta[];
}