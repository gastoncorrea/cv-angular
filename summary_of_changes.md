## Summary of Changes

This document summarizes the significant modifications made to the project.

### 1. Branch Management:
*   Created a new branch `get/Education` and switched to it.
*   Merged `get/Education` into `dev` (performed twice during the process).
*   Switched back to `get/Education` for further development.

### 2. Education Component (`src/app/components/education/`):

*   **`education.component.ts`**:
    *   Refactored to directly fetch education data from `EducacionService` using `getEducacionByPersonaId(1)`, removing reliance on `@Input()`.
    *   Added properties for `isLoading` and `errorMessage` to manage UI state during data fetching.
    *   Implemented `ngOnInit` to trigger data loading and `ngOnDestroy` to unsubscribe from the data subscription.

*   **`education.component.html`**:
    *   Updated to display loading (`isLoading`) and error (`errorMessage`) messages.
    *   Adjusted the conditional rendering of the education list to ensure the "Educación" title is always visible.
    *   Replaced the `<app-skills>` component with `<app-tools>` for displaying associated tools, passing `edu.herramientas` to the new `tools` input of `app-tools`.

### 3. Home Component (`src/app/components/home/`):

*   **`home.component.html`**:
    *   Removed the `[education]="persona.estudios"` input binding from the `<app-education>` component, as `EducationComponent` now fetches its own data directly.

### 4. Tools Component (`src/app/shared/components/tools/`):

*   **`tools.model.ts`**:
    *   Updated the `Herramienta` interface to accurately reflect server-side attributes.
    *   Changed `imagenUrl?: string;` to `logo?: string;` to match the server's `logo` attribute for images.
    *   Added `proyectos?: Proyecto[];` and `estudios?: Educacion[];` properties as per the OpenAPI specification.
    *   Explicitly marked `descripcion?` and `url?` as optional to align with server definitions.

*   **`tools.component.ts`**:
    *   Added `backendUrl: string;` property, initialized from `environment.backendUrl`, to construct full image URLs.
    *   Implemented the `getFullImageUrl` method:
        *   It now constructs absolute image URLs from `tool.logo`.
        *   It returns `undefined` if `tool.logo` is an empty string, null, or undefined, ensuring that no invalid image source is provided.

*   **`tools.component.html`**:
    *   The title `<span>Herramientas</span>` was changed to `<span>Tools Used</span>`.
    *   Modified to conditionally display either an `<img>` tag (using `getFullImageUrl(tool.logo)`) if a valid logo URL is available, or a Font Awesome icon (`<i class="fa-solid fa-screwdriver-wrench fa-5x"></i>`) as a fallback.
    *   Resolved `NG5002` compilation errors by restructuring the conditional rendering logic using two separate `div` elements with inverse `*ngIf` conditions instead of `ng-container` and `ng-template` for the primary image/icon display.
    *   The `alt` attribute for the image tag now uses `tool.nombre || 'Tool Image'`.
    *   Added conditional display for `tool.descripcion` and `tool.url`.

*   **`tools.component.css`**:
    *   Modified the `.tools-img` class to use flexbox (`display: flex; justify-content: center; align-items: center;`) and set a fixed `width` and `height` (`60px`) to consistently center and size both images and Font Awesome icons.

### 5. Assets:

*   **`src/assets/img/default-tool.svg`**:
    *   A placeholder SVG file was initially created for a default tool icon.
    *   This file was subsequently deleted as the decision was made to use Font Awesome icons directly for the default fallback.

### New Changes (Session Summary)

#### 1. Default Image Implementation for various Components

*   **`ToolsComponent`**:
    *   Updated `tools.component.ts`'s `getFullImageUrl` method to return `assets/img/icono-de-herramienta-logo.webp` as the default image when `tool.logo` is null or empty.
    *   Simplified `tools.component.html` to always render an `<img>` tag, relying on `getFullImageUrl` to provide a valid source.

*   **`SkillsComponent`**:
    *   Modified `skills.component.ts` to include `backendUrl` and a `getFullImageUrl` method, returning `assets/img/icono-de-herramienta-logo.webp` as the default.
    *   Updated `skills.component.html` to use `getFullImageUrl(skill.logo)` for the image source and added a conditional link for `skill.url`.

*   **`EducationComponent`**:
    *   Added `backendUrl` and a `getFullImageUrl` method to `education.component.ts`, returning `assets/img/logo_default_education.jpg` as the default for institution logos.
    *   Modified `education.component.html` to display the institution's logo using `getFullImageUrl(edu.logo_imagen)`.
    *   Added CSS rules to `education.component.css` for `.institution-logo` and `.title-education` to properly display and align the new logo.

*   **`ContactsComponent`**:
    *   Updated `contacts.component.ts`'s `getFullImageUrl` method to return `assets/img/contact-default-image.png` as the default image for contact logos when `contact.logo_img` is null or empty.

#### 2. `ProjectsComponent` Refactoring and Default Image

*   **`projects.component.ts`**:
    *   Refactored to fetch its own data using `ProyectoService.getProyectoByPersonaId(1)`.
    *   Removed the `@Input() projects` property.
    *   Added `isLoading`, `errorMessage`, and `projectsSubscription` properties for state management.
    *   Implemented a `getFullImageUrl` method, returning `assets/img/icono-de-proyecto-default.webp` as the default for project logos.
*   **`project.model.ts`**: Added a `logo?: string;` property to the `Proyecto` interface to accommodate project images.
*   **`projects.component.html`**:
    *   Removed the `[projects]="persona.proyectos"` binding from the `<app-projects>` tag in `src/app/components/home/home.component.html`.
    *   Updated to display loading/error messages.
    *   Added an `<img>` tag to display `project.logo` using `getFullImageUrl(project.logo)` with a default fallback.
    *   Replaced `<app-skills>` with `<app-tools>` and updated the input binding from `[skills]` to `[tools]` for displaying project tools.
*   **`projects.component.css`**: Added CSS rules for `.project-header` and `.project-logo` to properly display and align the new project logo.
