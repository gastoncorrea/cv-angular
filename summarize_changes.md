# Summary of Changes

This document summarizes the modifications made to the project's codebase.

## 1. `src/app/app.component.html`
-   **Fix:** Corrected the `*ngIf` condition for the login button to properly negate the observable result.
    -   **Old:** `<button *ngIf="!authService.isLoggedIn() | async" (click)="toggleAuthForms()">`        
    -   **New:** `<button *ngIf="!(authService.isLoggedIn() | async)" (click)="toggleAuthForms()">`      
-   **Feature:** Added an event listener `(loginSuccess)="onLoginSuccess()"` to the `<app-login-form>` component to automatically close the login form after successful authentication.

## 2. `src/app/app.component.ts`
-   **Feature:** Added a new method `onLoginSuccess()` which sets `this.showAuthForms = false;` to close the authentication forms container when a successful login event is received from the login form.

## 3. `src/app/auth.service.ts`
-   **Reverted:** Removed the `id_persona` property from the `AuthTokens` interface.
-   **Reverted:** Removed the logic for storing and clearing `id_persona` in `localStorage` from `saveTokens` and `clearTokens` methods.
-   **Reverted:** Removed the `getPersonId()` method.
    -   This change aligns the service with the new requirement that persona data is publicly accessible and the persona ID is not needed for general data fetching.

## 4. `src/app/components/education/education.component.ts`
-   **Reverted:** Reintroduced `private readonly PUBLIC_PERSONA_ID = 1;`.
-   **Reverted:** Modified `loadEducationData()` to use `this.PUBLIC_PERSONA_ID` instead of `authService.getPersonId()` for fetching education data.
-   **Note:** `AuthService` remains injected as it's used for checking login status (`isLoggedIn()`) in the template.
    -   This change aligns with the new requirement of publicly accessible persona data.

## 5. `src/app/components/home/home.component.ts`
-   **Reverted:** Reintroduced `private readonly PUBLIC_PERSONA_ID = 1;`.
-   **Reverted:** Modified `loadPersonaData()` to use `this.PUBLIC_PERSONA_ID` instead of `authService.getPersonId()` for fetching persona data.
-   **Reverted:** Removed `private authService: AuthService` from the constructor as it's no longer needed for getting the person ID, aligning with the publicly accessible persona data approach.

## 6. `src/app/pages/auth/login-form/login-form.component.ts`
-   **Feature:** Added `@Output() loginSuccess = new EventEmitter<void>();` to emit an event on successful login.
-   **Feature:** Modified `sendLogin()` to emit `this.loginSuccess.emit();` after a successful login.    

## 7. `src/app/components/projects/projects.component.ts`
-   **Reverted:** Reintroduced `private readonly PUBLIC_PERSONA_ID = 1;`.
-   **Reverted:** Modified `loadProjectData()` to use `this.PUBLIC_PERSONA_ID` instead of `authService.getPersonId()` for fetching project data.
-   **Note:** `AuthService` remains injected as it's used for checking login status (`isLoggedIn()`) in the template.
    -   This change aligns with the new requirement of publicly accessible persona data.

## 8. `src/app/components/skills/skills.component.ts`
-   **Reverted:** Reintroduced `private readonly PUBLIC_PERSONA_ID = 1;`.
-   **Reverted:** Modified `loadAllUsageData()` to use `this.PUBLIC_PERSONA_ID` instead of `authService.getPersonId()` for fetching project and education data.
-   **Note:** `AuthService` remains injected as it's used for checking login status (`isLoggedIn()`) in the template.
    -   This change aligns with the new requirement of publicly accessible persona data.

---

## Recent Changes

## 1. `src/app/app-routing.module.ts`
   - **Fix:** Re-added the `/home` route that renders the `HomeComponent`. This fixes the `NG04002: Cannot match any routes` error.

## 2. `src/app/components/personal-data/personal-data.component.ts`
   - **Feature:** Injected `AuthService` into the constructor and made it public for conditional display of edit buttons.
   - **Fix:** Added a placeholder `editPersona(): void` method.
   - **Feature:** Added a placeholder `editPhoto(): void` method for the new edit photo button.

## 3. `src/app/components/personal-data/personal-data.component.html`
   - **Feature:** Added an "edit photo" button (`.btn-edit-photo`) next to the profile image, visible only when logged in.
   - **Feature/Fix:** Restructured the layout to place the main "edit record" button (`.btn-edit`) in a separate container (`.personal-info-actions`) above the text, aligned to the right. The personal text information (`h1`, `h3`, `p`) is now in a centered container (`.personal-info-text`).

## 4. `src/app/components/personal-data/personal-data.component.css`
   - **Feature:** Added CSS for `.personal-img-container` (relative positioning) and `.btn-edit-photo` (absolute positioning, circular shape).
   - **Feature/Fix:** Reworked CSS for `.personal-info-actions`, `.personal-info-text` to achieve the desired layout: text centered, edit button above and to the right.
   - **Usability:** Increased `font-size` to `1.5em` and added `padding: 5px;` to `.personal-info-actions .btn-edit`.
   - **Spacing:** Added `margin-top: 20px;` to `.personal-info-actions` to ensure adequate spacing.
   - **Readability:** Changed `line-height` for `.personal-info-text` to `1.5`.

## 5. `src/app/components/contacts/contacts.component.ts`
   - **Feature:** Added a placeholder `editContact(contact: Contacto): void` method.
   - **Feature:** Added a placeholder `deleteContact(contact: Contacto): void` method.

## 6. `src/app/components/contacts/contacts.component.html`
   - **Feature:** Added an edit button (`.btn-edit`) and a delete button (`.btn-delete`) to each contact record, visible only when logged in, grouped in a `.crud-buttons` div.
   - **Fix:** Corrected the HTML structure to ensure `a.button-contact` comes first, then `div.crud-buttons`, both as direct children of `.contacto`.

## 7. `src/app/components/contacts/contacts.component.css`
   - **Feature:** Added CSS for `.btn-edit` and `.btn-delete` for contacts, including positioning and styling.
   - **Fix:** Modified `.contacto` to `display: flex; flex-direction: column; align-items: center;` to stack content and buttons vertically.
   - **Fix:** Modified `.crud-buttons` to remove `position: absolute;` and instead use `width: 100%; display: flex; justify-content: flex-end;` to align the action buttons to the right.
   - **Fix:** Changed `color` for `.crud-buttons .btn-delete` and its hover state to match the edit button (`#AB77FF` and `#8A5BBF`).
   - **Fix:** Added `margin-top: 5px;` to `.crud-buttons` for spacing.
   - **Fix:** Added `width: 100%;` and `max-width: 100%;` to `.button-contact`.

## 8. `src/app/components/education/education.component.ts`
   - **Feature:** Added a placeholder `editEducation(education: Educacion): void` method.
   - **Feature:** Added a placeholder `deleteEducation(education: Educacion): void` method.

## 9. `src/app/components/education/education.component.html`
   - **Feature:** Added an edit button (`.btn-edit`) and a delete button (`.btn-delete`) to each education record, visible only when logged in, grouped in a `.crud-buttons` div.

## 10. `src/app/components/education/education.component.css`
    - **Feature:** Added CSS for `.btn-edit` and `.btn-delete` for education, including positioning and styling.
    - **Fix:** Modified `.education-item` to `position: relative;` and added a `.crud-buttons` container with `position: absolute;` and flex properties.
    - **Usability:** Increased `font-size` to `1.5em` and added `padding: 5px;` to `.education-item .btn-edit`.
    - **Fix:** Changed `color` for `.education-item .crud-buttons .btn-delete` and its hover state to match the edit button (`#AB77FF` and `#8A5BBF`).

## 11. `src/app/components/projects/projects.component.ts`
    - **Feature:** Added a placeholder `editProject(project: Proyecto): void` method.
    - **Feature:** Added a placeholder `deleteProject(project: Proyecto): void` method.

## 12. `src/app/components/projects/projects.component.html`
    - **Feature:** Added an edit button (`.btn-edit`) and a delete button (`.btn-delete`) to each project record, visible only when logged in, grouped in a `.crud-buttons` div.

## 13. `src/app/components/projects/projects.component.css`
    - **Feature:** Added CSS for `.btn-edit` and `.btn-delete` for projects, including positioning and styling.
    - **Fix:** Modified `.experience-item` to `position: relative;` and added a `.crud-buttons` container with `position: absolute;` and flex properties.
    - **Usability:** Increased `font-size` to `1.5em` and added `padding: 5px;` to `.experience-item .btn-edit`.
    - **Fix:** Changed `color` for `.experience-item .crud-buttons .btn-delete` and its hover state to match the edit button (`#AB77FF` and `#8A5BBF`).