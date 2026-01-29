import { Proyecto } from './project.model';
import { Educacion } from './education.model';

export interface Herramienta {
    id_herramienta?: number;
    nombre: string;
    version: string;
    descripcion?: string; // Optional as per server attributes
    url?: string; // Optional as per server attributes
    logo?: string; // Corrected to 'logo' as per server attributes
    proyectos?: Proyecto[];
    estudios?: Educacion[];
}