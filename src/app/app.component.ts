import { Component } from '@angular/core';
import { AuthService } from './auth.service'; // Import AuthService
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cv-angular';
  public showAuthForms: boolean = false; // New property to control visibility, made public

  constructor(
    public authService: AuthService, // Inject AuthService and make it public for template
    private router: Router // Inject Router
  ) { }

  toggleAuthForms(): void {
    this.showAuthForms = !this.showAuthForms;
  }

  onLoginSuccess(): void {
    this.showAuthForms = false; // Close the auth forms on successful login
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Navigate to home or login page after logout
    this.showAuthForms = false; // Close the auth forms if open
  }
}
