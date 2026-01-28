import { Component, Input } from '@angular/core';
import { Contacto } from 'src/app/models/contact.model'; // Import Contacto
import { environment } from 'src/environments/environment'; // Import environment

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {
  @Input() contacts: Contacto[] | undefined; // Now receives data via Input
  backendUrl: string; // Declare backendUrl property

  constructor() {
    this.backendUrl = environment.backendUrl; // Initialize in constructor
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
    return 'assets/img/default-contact.png'; // Fallback image for contacts
  }
}
