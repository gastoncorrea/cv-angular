import { Herramienta } from './tools.model'; // Import Herramienta
// import { Persona } from './person.model'; // Avoid circular dependency for now

export interface Educacion {
    id_educacion?: number;
    nombre_institucion: string;
    logo_imagen: string;
    fecha_inicio: string;
    fecha_fin: string;
    titulo: string;
    url_titulo: string;
    persona?: any; // Acknowledge persona property, avoid circular dependency
    herramientas?: Herramienta[]; // Added missing herramientas property
}