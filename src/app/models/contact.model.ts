export interface Contacto {
    id_contacto?: number;
    nombre: string;
    url_contacto: string;
    logo_img?: string;
    persona?: { id_persona: number };
}

export interface ContactoDto {
    id_contacto: number;
    nombre: string;
    url_contacto: string;
    logo_img: string;
}