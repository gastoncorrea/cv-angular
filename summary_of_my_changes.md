## Resumen de Cambios Realizados (Actualizado)

### 1. Refinamiento del Interceptor de Autenticación
*   **`src/app/auth.interceptor.ts`**: Se modificó para manejar tanto los errores `401 Unauthorized` como `403 Forbidden`, asegurando el cierre de sesión y la recarga de página en ambos casos.

### 2. Funcionalidad de Subida de Imagen de Perfil
*   **`src/app/components/personal-data/personal-data.component.ts`**:
    *   Se inyectó `PersonaService`.
    *   Se agregaron propiedades para la gestión del formulario de subida (`showUploadForm`, `selectedFile`, `previewUrl`, `isLoading`, `errorMessage`).
    *   Se añadió un `@Output() onUploadSuccess` para notificar al componente padre.
    *   Se implementaron `toggleUploadForm()`, `cancelUpload()`, `onFileSelected()`, y `onUpload()`.
    *   Se corrigió el método `onUpload()` para verificar `personalData.id_persona` antes de llamar al servicio, resolviendo un error de compilación.
*   **`src/app/components/personal-data/personal-data.component.html`**:
    *   El botón del icono de la cámara ahora llama a `toggleUploadForm()`.
    *   Se añadió una sección de formulario para la subida de archivos (condicionalmente visible con `*ngIf="showUploadForm"`), incluyendo un input de archivo, vista previa y botones "Subir"/"Cancelar".
*   **`src/app/components/personal-data/personal-data.component.css`**: Se añadieron reglas CSS para estilizar el nuevo formulario de subida de imagen, manteniendo la coherencia visual.
*   **`src/app/components/home/home.component.html`**: Se añadió un *event binding* `(onUploadSuccess)="loadPersonaData()"` al componente `<app-personal-data>` para recargar los datos de la persona después de una subida exitosa de la imagen de perfil.

### 3. Gestión de Contactos (Proceso de Dos Pasos y Subida de Imagen)
*   **Creación de Nuevo Servicio**:
    *   Se creó `src/app/core/services/contact.service.ts` con métodos CRUD básicos (`saveContact`, `updateContact`, `deleteContact`, `getContactsByPersonaId`) y un método específico `updateContactImage` para subir la imagen del logo de un contacto.
*   **Actualización del Modelo**:
    *   **`src/app/models/contact.model.ts`**:
        *   Se hizo la propiedad `logo_img` opcional (`logo_img?: string;`).
        *   Se añadió una propiedad opcional `persona?: { id_persona: number };` para permitir que el frontend envíe el ID de la persona asociada en el cuerpo de la solicitud al guardar un contacto.
*   **Lógica del Componente (`src/app/components/contacts/contacts.component.ts`)**:
    *   Se inyectó `ContactService`.
    *   Se añadió `@Input() personaId` y `@Output() onContactAdded`.
    *   Se agregaron propiedades para la gestión del formulario y la subida de imagen (`showAddContactForm`, `newContact`, `isLoading`, `errorMessage`, `editingContactId`, `savedContactId`, `selectedFile`, `previewUrl`, `uploadingImage`, `imageErrorMessage`).
    *   Se implementaron `ngOnInit` y `ngOnChanges` para inicializar `newContact.persona` con `personaId`.
    *   **`onSaveContact()`**: Se modificó para asignar `newContact.persona`, capturar `savedContactId` de la respuesta del backend, y *no* emitir `onContactAdded` de inmediato, manteniendo el formulario abierto.
    *   Se implementaron `onFileSelected()`, `onUploadContactImage()` y `cancelImageUpload()`.
    *   **`cancelAddContact()`**: Se modificó para resetear `savedContactId` y `cancelImageUpload()`.
    *   Se aseguró que `onContactAdded.emit()` se llama al finalizar el proceso completo (tras subir la imagen exitosamente o al cancelar el formulario después de guardar el texto).
*   **HTML del Componente (`src/app/components/contacts/contacts.component.html`)**:
    *   El botón "añadir" ahora llama a `toggleAddContactForm()`.
    *   El formulario de "agregar contacto" (`add-form-container`) se reestructuró para ser un **único elemento `<form>`** que gestiona todo el proceso.
    *   Los campos de texto (`nombre`, `url_contacto`) se deshabilitan con `[disabled]="!!savedContactId"` una vez que el contacto inicial se guarda.
    *   La sección de subida de imagen (`image-upload-section`) se muestra condicionalmente (`*ngIf="savedContactId"`) *dentro del mismo formulario* para una experiencia fluida de dos pasos.
    *   Las acciones del formulario (`form-actions`) cambian dinámicamente entre "Guardar Contacto" / "Cerrar" y "Subir Logo" / "Finalizar" según el estado de `savedContactId`.
    *   Se añadió `addContactForm="ngForm"` para validación.
*   **CSS del Componente (`src/app/components/contacts/contacts.component.css`)**:
    *   Se sobrescribió el archivo completo para utilizar **CSS Grid** para el contenedor `.iconos-contacto` y sus elementos.
    *   Se configuró `display: grid;` y `grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));` en `.iconos-contacto`, tal como se solicitó.
    *   Se eliminaron las propiedades de Flexbox en conflicto de `.iconos-contacto` y `.contacto` donde las reglas de Grid tomaron el control.
    *   Se mantuvo el diseño `display: flex; flex-direction: column; align-items: center;` para el diseño interno de cada elemento `.contacto`.
    *   Se añadieron estilos específicos para la nueva sección de subida de imagen en línea dentro de `add-form-container`.