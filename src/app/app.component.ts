import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cv-angular';
  showAuthForms: boolean = false; // New property to control visibility

  toggleAuthForms(): void {
    this.showAuthForms = !this.showAuthForms;
  }
}
