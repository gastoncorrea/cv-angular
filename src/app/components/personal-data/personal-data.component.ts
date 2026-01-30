import { Component, Input } from '@angular/core';
import { Persona } from 'src/app/models/person.model';
import { environment } from 'src/environments/environment'; // Import environment
import { AuthService } from 'src/app/auth.service'; // Import AuthService

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent {
  @Input() personalData: Persona | undefined; // Now receives data via Input
  backendUrl: string; // Declare backendUrl property

  constructor(
    public authService: AuthService // Inject AuthService
  ) {
    this.backendUrl = environment.backendUrl; // Initialize in constructor
  }

  editPersona(): void {
    console.log('Edit persona data');
    // Future implementation: Navigate to edit form or open modal
  }

  editPhoto(): void {
    console.log('Edit profile photo');
    // Future implementation: Navigate to photo upload/edit route
  }

  calculateAge(birthdateString: string): number {
    if (!birthdateString) return 0;
    const birthdate = new Date(birthdateString);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return age;
  }

  // Method to construct the full image URL
  getFullImageUrl(relativeUrl: string | null | undefined): string {
    if (relativeUrl) {
      // Check if the relativeUrl is already an absolute URL or a data URL
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://') || relativeUrl.startsWith('data:')) {
        return relativeUrl;
      }
      return `${this.backendUrl}${relativeUrl}`;
    }
    return 'assets/img/default-profile.jpg'; // Fallback image
  }
}
