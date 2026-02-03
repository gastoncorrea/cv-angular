## Resumen de Cambios Realizados

### 1. Manejo de Autenticación (`src/app/auth.interceptor.ts`)

*   Se mejoró el `AuthInterceptor` para detectar errores `401 Unauthorized` (token inválido o expirado).
*   Cuando se detecta un `401`, el interceptor ahora llama a `authService.logout()` para limpiar los tokens del `localStorage`.
*   Después de limpiar los tokens, se fuerza una recarga de la página (`location.reload()`) para asegurar que la aplicación reinicie su estado de autenticación correctamente, evitando que la UI muestre un estado de "logueado" incorrecto con tokens expirados.

### 2. Funcionalidad de Subida de Imagen de Perfil

Esta funcionalidad se implementó a través de múltiples archivos:

*   **`src/app/components/home/home.component.html`**
    *   Se añadió un *event listener* `(onUploadSuccess)="loadPersonaData()"` al componente `<app-personal-data>`. Esto asegura que, después de una subida exitosa de imagen en el componente hijo, el componente padre (`HomeComponent`) recargue los datos de la persona para reflejar la nueva imagen.

*   **`src/app/components/personal-data/personal-data.component.ts`**
    *   Se inyectó `PersonaService` para interactuar con el backend.
    *   Se agregaron nuevas propiedades para gestionar la UI del formulario de subida: `showUploadForm`, `selectedFile`, `previewUrl`, `isLoading`, `errorMessage`.
    *   Se definió un `@Output() onUploadSuccess` para emitir eventos al componente padre.
    *   Se implementaron los métodos `toggleUploadForm()`, `cancelUpload()`, `onFileSelected()` y `onUpload()`.
    *   **Corrección de error**: En el método `onUpload()`, se añadió una comprobación explícita para `this.personalData.id_persona` (`if (!this.selectedFile || !this.personalData || !this.personalData.id_persona)`) para resolver un error de compilación de TypeScript (TS2345) y asegurar que el ID de la persona siempre sea un `number` válido al llamar al servicio.

*   **`src/app/components/personal-data/personal-data.component.html`**
    *   El botón del icono de la cámara ahora llama a `toggleUploadForm()` para mostrar u ocultar el formulario de subida.
    *   Se añadió una nueva sección de formulario (`<div *ngIf="showUploadForm">`) que incluye:
        *   Un input de tipo `file` para seleccionar la imagen.
        *   Una vista previa de la imagen seleccionada.
        *   Botones "Subir" y "Cancelar" conectados a los métodos `onUpload()` y `cancelUpload()`.
        *   Indicadores de carga y mensajes de error.

*   **`src/app/components/personal-data/personal-data.component.css`**
    *   Se agregaron nuevos estilos CSS para el contenedor del formulario de subida, los elementos del formulario, la vista previa de la imagen y los botones, asegurando que la nueva funcionalidad se integre visualmente con el diseño existente del proyecto.
