import { Herramienta } from './tools.model'; // Import Herramienta
// import { Persona } from './person.model'; // Avoid circular dependency for now

export interface Proyecto {
    id_proyecto?: number;
    nombre: string;
    descripcion: string;
    url: string;
    inicio: string;
    fin: string;
    persona?: any; // Acknowledge persona property, avoid circular dependency
    herramientas?: Herramienta[]; // Added missing herramientas property
}