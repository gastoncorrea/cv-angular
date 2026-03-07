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

---

### Refactorización para ID de Persona Dinámico y Perfil Principal

Se eliminaron todas las referencias estáticas al ID de persona (`PUBLIC_PERSONA_ID = 1`) para permitir que la aplicación cargue dinámicamente el perfil configurado como principal en el backend.

*   **PersonaService (`src/app/core/services/persona.service.ts`)**:
    *   Se implementó el método `getPersonaMain()`, el cual realiza una petición GET a `${backendUrl}/persona/main` para obtener el perfil de la persona marcada como principal.

*   **HomeComponent (`src/app/components/home/home.component.ts` & `.html`)**:
    *   Se eliminó la constante estática `PUBLIC_PERSONA_ID`.
    *   Ahora utiliza `personaService.getPersonaMain()` en el arranque para obtener los datos básicos y el ID de la persona.
    *   El ID obtenido se propaga dinámicamente a los componentes hijos (`ProjectsComponent`, `EducationComponent`, `SkillsComponent`, `ContactsComponent`) mediante la propiedad `[personaId]`.

*   **ProjectsComponent, EducationComponent & SkillsComponent**:
    *   Se eliminaron las constantes estáticas `PUBLIC_PERSONA_ID`.
    *   Se añadió el decorador `@Input() personaId: number | undefined`.
    *   Se implementó el ciclo de vida `ngOnChanges` para detectar cambios en el `personaId` y disparar la recarga de datos específica (proyectos, educación, herramientas/habilidades) de forma reactiva.
    *   Se ajustaron los métodos de guardado para asociar correctamente los nuevos registros al `personaId` dinámico.

*   **Consistencia de Datos**:
    *   Esta refactorización garantiza que si el backend cambia la persona principal, el frontend reflejará automáticamente toda la información asociada (experiencia, estudios, habilidades) sin necesidad de modificar el código fuente.

---

### Gestión de Múltiples Residencias en Datos Personales

Se ha mejorado el formulario de edición de información personal para permitir la gestión integral de una o varias residencias de forma dinámica.

*   **PersonalDataComponent (`src/app/components/personal-data/personal-data.component.ts`)**:
    *   Se implementó un `FormArray` llamado `residencias` dentro del `personaForm` reactivo.
    *   Se añadieron métodos `addResidence()` y `removeResidence(index)` para permitir al usuario añadir o eliminar campos de residencia dinámicamente en la interfaz.
    *   La lógica de `editPersona()` ahora limpia y puebla el `FormArray` con los datos actuales de la persona.
    *   El método `onSavePersona()` se actualizó para gestionar las residencias de forma individual a través de `ResidenceService`:
        *   Se utiliza `forkJoin` para ejecutar en paralelo la actualización de la persona, la creación/actualización de cada residencia y la eliminación de aquellas que fueron quitadas durante la edición.
        *   Cada residencia se vincula explícitamente al ID de la persona mediante el objeto `persona: { id_persona: ... }`.


*   **Interfaz de Usuario (`personal-data.component.html` & `.css`)**:
    *   Se añadió una nueva sección en el formulario de edición con un diseño limpio y estructurado para las residencias.
    *   Cada bloque de residencia permite editar Localidad, Provincia, País y Nacionalidad.
    *   Se incluyeron botones con iconos de FontAwesome para añadir nuevas residencias o eliminar las existentes, mejorando la experiencia de usuario (UX).
    *   Se aplicaron estilos responsivos y feedback visual (mensajes cuando no hay items) para mantener la coherencia estética de la aplicación.


