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
   - **Fix:** Re-added the `/home` route that renders the `HomeComponent`. This fixes the `NG04002: Cannot match any routes. URL Segment: 'home'` error that occurred after a successful login.

## 2. `src/app/components/contacts/contacts.component.ts`
   - **Feature:** Injected `AuthService` into the constructor and made it public to allow authentication-based features in the template.

## 3. `src/app/components/contacts/contacts.component.html`
   - **Feature:** Added an 'add' button to the contacts component. This button is only visible when a user is logged in (`*ngIf="authService.isLoggedIn() | async"`).

## 4. `src/app/components/contacts/contacts.component.css`
   - **Feature:** Added CSS rules for `.edit-buttons-container` and `.edit-buttons .btn-add` to style the new edit button.

## 5. `src/app/components/education/education.component.html`
   - **Feature:** Added an 'add' button to the education component. This button is only visible when a user is logged in (`*ngIf="authService.isLoggedIn() | async"`).

## 6. `src/app/components/education/education.component.css`
   - **Feature:** Added CSS rules for `.edit-buttons-container` and `.edit-buttons .btn-add` to style the new edit button.

## 7. `src/app/components/projects/projects.component.html`
   - **Feature:** Added an 'add' button to the projects component. This button is only visible when a user is logged in (`*ngIf="authService.isLoggedIn() | async"`).

## 8. `src/app/components/projects/projects.component.css`
   - **Feature:** Added CSS rules for `.edit-buttons-container` and `.edit-buttons .btn-add` to style the new edit button.