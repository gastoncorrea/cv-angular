export interface Rol {
  id_rol?: number;
  nombre: string;
}

export interface UsuarioApi {
  id_usuario?: number;
  email: string;
  nombre: string;
  password?: string;
  rol?: Rol[];
}

export interface UsuarioDto {
  id_usuario?: number;
  email: string;
  nombre: string;
  password?: string;
  rol?: Rol[];
}

export interface RolToUserForm {
  email: string;
  rolName: string;
}
