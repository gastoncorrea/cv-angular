import { Proyecto } from './project.model';
import { Educacion } from './education.model';

export interface Herramienta {
    id_herramienta?: number;
    nombre: string;
    version: string;
    descripcion?: string;
    url?: string;
    logo?: string;
    proyectos?: Proyecto[];
    estudios?: Educacion[];
}

export interface HerramientaDto {
    id_herramienta: number;
    nombre: string;
    version: string;
    descripcion?: string;
    url?: string;
    logo?: string;
}