import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { Contacto } from 'src/app/models/contact.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit, OnChanges {
  @Input() contacts: Contacto[] | undefined;
  @Input() personaId: number | undefined;
  @Output() onContactAdded = new EventEmitter<void>();

  backendUrl: string;
  showAddContactForm = false;
  newContact: Contacto = { nombre: '', url_contacto: '' };
  isLoading = false;
  errorMessage = '';

  editingContactId: number | null = null;
  savedContactId: number | null = null; // New property for two-step process
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  uploadingImage: boolean = false;
  imageErrorMessage: string = '';

  constructor(
    public authService: AuthService,
    private contactService: ContactService
  ) {
    this.backendUrl = environment.backendUrl;
  }

  ngOnInit(): void {
    // Initialize newContact with personaId if available
    if (this.personaId) {
      this.newContact.persona = { id_persona: this.personaId };
    }
  }

  // Lifecycle hook to detect changes to personaId (e.g., if parent passes it later)
  ngOnChanges(): void {
    if (this.personaId && (!this.newContact.persona || this.newContact.persona.id_persona !== this.personaId)) {
      this.newContact.persona = { id_persona: this.personaId };
    }
  }

  editContact(contact: Contacto): void {
    if (contact.id_contacto) {
      this.editingContactId = contact.id_contacto;
      this.selectedFile = null;
      this.previewUrl = null;
      this.uploadingImage = false;
      this.imageErrorMessage = '';
      console.log('Editing contact with ID:', this.editingContactId);
    } else {
      console.error('Cannot edit contact without an ID.');
    }
  }

  deleteContact(contact: Contacto): void {
    console.log('Delete contact:', contact);
    // Future implementation: Confirmation dialog and then call service to delete
  }

  toggleAddContactForm(): void {
    this.showAddContactForm = !this.showAddContactForm;
    if (!this.showAddContactForm) {
      this.cancelAddContact();
    } else {
      // Re-initialize newContact's persona on opening the form
      if (this.personaId && (!this.newContact.persona || this.newContact.persona.id_persona !== this.personaId)) {
        this.newContact.persona = { id_persona: this.personaId };
      }
    }
  }

  cancelAddContact(): void {
    this.showAddContactForm = false;
    this.newContact = { nombre: '', url_contacto: '' };
    this.savedContactId = null; // Reset saved contact ID
    this.errorMessage = '';
    this.cancelImageUpload(); // Also reset image upload state if any
  }

    onSaveContact(): void {

      if (!this.newContact.nombre || !this.newContact.url_contacto) {

        this.errorMessage = 'Nombre y URL del contacto son obligatorios.';

        return;

      }

      if (!this.newContact.persona || !this.newContact.persona.id_persona) {

        this.errorMessage = 'No se puede agregar el contacto sin el ID de la persona.';

        console.error('Error: Persona ID is missing for new contact.');

        return;

      }

  

      this.isLoading = true;

      this.errorMessage = '';

  

      this.contactService.saveContact(this.newContact).subscribe({

        next: (savedContact) => {

          this.isLoading = false;

          this.savedContactId = savedContact.id_contacto || null; // Store the ID of the newly saved contact

          this.errorMessage = ''; // Clear any previous errors

  

          // Do NOT emit onContactAdded here. It will be emitted after image upload or final cancellation.

        },

        error: (err) => {

          this.isLoading = false;

          this.errorMessage = 'Error al agregar el contacto. Por favor, inténtalo de nuevo.';

          console.error('Add contact error:', err);

        }

      });

    }

  

    onFileSelected(event: any): void {

      const file = event.target.files[0];

      if (file) {

        this.selectedFile = file;

        const reader = new FileReader();

        reader.onload = () => {

          this.previewUrl = reader.result;

        };

        reader.readAsDataURL(file);

      }

    }

  

    onUploadContactImage(contactId: number | undefined): void {

      if (!this.selectedFile || !contactId) {

        this.imageErrorMessage = 'Por favor, selecciona un archivo y asegúrate de que el contacto tenga un ID.';

        return;

      }

  

      this.uploadingImage = true;

      this.imageErrorMessage = '';

  

      this.contactService.updateContactImage(contactId, this.selectedFile).subscribe({

        next: () => {

          this.uploadingImage = false;

          this.onContactAdded.emit(); // Reload contacts to show new image

          this.cancelImageUpload(); // Reset image upload state

          this.cancelAddContact(); // Close the add form after image upload

        },

        error: (err) => {

          this.uploadingImage = false;

          this.imageErrorMessage = 'Error al subir la imagen. Por favor, inténtalo de nuevo.';

          console.error('Upload contact image error:', err);

        }

      });

    }

  

    cancelImageUpload(): void {

      this.editingContactId = null;

      this.selectedFile = null;

      this.previewUrl = null;

      this.imageErrorMessage = '';

    }

  

    getFullImageUrl(relativeUrl: string | null | undefined): string {

      if (relativeUrl) {

        if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://') || relativeUrl.startsWith('data:')) {

          return relativeUrl;

        }

        return `${this.backendUrl}${relativeUrl}`;

      }

      return 'assets/img/contact-default-image.png';

    }

  }

  