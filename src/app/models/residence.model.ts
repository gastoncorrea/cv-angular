export interface Residencia {
    id_residencia?: number;
    localidad: string;
    provincia: string;
    pais: string;
    nacionalidad: string;
    persona?: { id_persona: number };
}

export interface ResidenciaDto {
    id_residencia: number;
    localidad: string;
    provincia: string;
    pais: string;
    nacionalidad: string;
}