export interface Contacto{
    id_contacto?: number;
    nombre: string;
    url_contacto: string;
    logo_img?: string; // Made optional
    persona?: { id_persona: number }; // Added for saving new contacts
}