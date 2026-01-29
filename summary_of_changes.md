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