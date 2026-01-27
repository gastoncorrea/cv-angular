// import { Persona } from './person.model'; // Avoid circular dependency for now

export interface Residencia {
    id_residencia?: number;
    localidad: string;
    provincia: string;
    pais: string;
    nacionalidad: string;
    persona?: any; // Acknowledge persona property, avoid circular dependency
}