## Resumen de Cambios - Sesión de Gestión de Herramientas y Unificación de Formularios

### 1. Backend Integration & Models
*   **Modelos (`tools.model.ts`):** Se añadieron `HerramientaRequestDto`, `ProyectoHerramientasDto` y `EducacionHerramientasDto`.
*   **Servicios de Negocio:**
    *   `ProyectoService` y `EducacionService` actualizados para soportar la adición de herramientas y la nueva funcionalidad de desvinculación bidireccional mediante `DELETE`.
    *   Se implementó el manejo de errores mejorado para capturar mensajes específicos del servidor.

### 2. Control de Interfaz (UX)
*   **`FormManagementService`:** Nuevo servicio que gestiona el estado de los formularios abiertos. Ahora, al abrir cualquier formulario (edición de persona, añadir proyecto, herramientas, etc.), se cierran automáticamente los demás, manteniendo la interfaz limpia.
*   **Validación de Duplicados:** En los formularios de "Añadir Herramienta", las herramientas que ya pertenecen al proyecto o educación aparecen deshabilitadas con la etiqueta "- Ya agregada".

### 3. Componentes de Proyectos y Educación
*   **CRUD de Herramientas:**
    *   Botón de "Añadir Herramienta" integrado como icono de FontAwesome junto a los botones de edición/borrado.
    *   Formulario dinámico que permite seleccionar una herramienta existente o crear una nueva (incluyendo nombre, versión, descripción, URL y logo).
    *   Proceso automatizado de guardado: creación de herramienta -> asociación al padre -> subida de imagen.
    *   Funcionalidad de desvinculación funcional conectada a los nuevos endpoints del backend.

### 4. Componente de Datos Personales
*   **Unificación del Formulario:** El formulario de actualización de información personal ahora es un componente "inline" dentro de `PersonalDataComponent`. Se eliminó la navegación a la ruta `/persona/edit`.
*   **Consistencia Visual:** Se aplicaron los estilos estándar de la aplicación al nuevo formulario integrado.

### 5. Componente de Herramientas (Compartido)
*   **Layout Responsivo:** Se implementó un CSS Grid con `repeat(auto-fit, minmax(calc(25% - 15px), 1fr))` para mostrar un máximo de 4 herramientas por fila, expandiéndose si hay menos.
*   **Atributos de Herramienta:** Se añadió soporte para mostrar y capturar la URL del recurso (ej: perfil de GitHub).
*   **Botones CRUD:** Cada tarjeta de herramienta ahora cuenta con botones de edición y desvinculación (visibles solo tras login).

### 6. Correcciones Técnicas
*   Se corrigieron errores de duplicidad de imports en `ProjectsComponent`.
*   Se restauraron los decoradores `@Component` y los ciclos de vida `OnInit`/`OnDestroy` en `EducationComponent`.
*   Se ajustó el modificador de acceso de servicios para permitir su uso directo en plantillas HTML.
