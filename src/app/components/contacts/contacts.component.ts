import { Component, Input } from '@angular/core';
import { Contacto } from 'src/app/models/contact.model'; // Import Contacto

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {
  @Input() contacts: Contacto[] | undefined; // Now receives data via Input
}
