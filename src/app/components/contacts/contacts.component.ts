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
  savedContactId: number | null = null;
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
    if (this.personaId) {
      this.newContact.persona = { id_persona: this.personaId };
    }
  }

  ngOnChanges(): void {
    if (this.personaId && (!this.newContact.persona || this.newContact.persona.id_persona !== this.personaId)) {
      this.newContact.persona = { id_persona: this.personaId };
    }
  }

  editContact(contact: Contacto): void {
    if (contact.id_contacto) {
      this.editingContactId = contact.id_contacto;
      // Create a copy to avoid modifying the original object in the list
      this.newContact = { ...contact }; 
      this.showAddContactForm = true; // Open the main form
      this.cancelImageUpload(); // Reset any lingering image previews
    } else {
      console.error('Cannot edit contact without an ID.');
    }
  }
  
  deleteContact(contact: Contacto): void {
    if (!contact.id_contacto) {
      console.error('Cannot delete contact without an ID.');
      this.errorMessage = 'No se puede eliminar un contacto sin ID.';
      return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar el contacto ${contact.nombre}?`)) {
      this.isLoading = true;
      this.errorMessage = ''; // Clear previous error messages

      this.contactService.deleteContact(contact.id_contacto).subscribe({
        next: () => {
          this.isLoading = false;
          this.onContactAdded.emit(); // Refresh the contact list
          console.log(`Contacto ${contact.nombre} eliminado con éxito.`);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = `Error al eliminar el contacto ${contact.nombre}.`;
          console.error('Delete contact error:', err);
        }
      });
    }
  }

  toggleAddContactForm(): void {
    this.showAddContactForm = !this.showAddContactForm;
    if (!this.showAddContactForm) {
      this.cancelAddContact();
    } else {
      if (this.personaId && (!this.newContact.persona || this.newContact.persona.id_persona !== this.personaId)) {
        this.newContact.persona = { id_persona: this.personaId };
      }
    }
  }

  cancelAddContact(): void {
    // If we were in the middle of a create/edit flow, emit to refresh parent data.
    if (this.savedContactId) {
      this.onContactAdded.emit();
    }
    this.showAddContactForm = false;
    this.newContact = { nombre: '', url_contacto: '' };
    this.editingContactId = null; // Also reset editing state
    this.savedContactId = null;
    this.errorMessage = '';
    this.cancelImageUpload();
  }

  onSaveContact(): void {
    if (!this.newContact.nombre || !this.newContact.url_contacto) {
      this.errorMessage = 'Nombre y URL del contacto son obligatorios.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const contactData: Contacto = { ...this.newContact };

    if (this.editingContactId) {
      // UPDATE existing contact
      this.contactService.updateContact(this.editingContactId, contactData).subscribe({
        next: (updatedContact) => {
          this.isLoading = false;
          this.savedContactId = this.editingContactId; // Use editingContactId as savedContactId
          // DO NOT emit here. The form should stay open for the image upload step.
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Error al actualizar el contacto.';
          console.error('Update contact error:', err);
        }
      });
    } else {
      // CREATE new contact
      if (!contactData.persona || !contactData.persona.id_persona) {
        this.errorMessage = 'No se puede agregar el contacto sin el ID de la persona.';
        return;
      }
      this.contactService.saveContact(contactData).subscribe({
        next: (savedContact) => {
          this.isLoading = false;
          this.savedContactId = savedContact.id_contacto || null;
          // Form stays open for image upload
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Error al agregar el contacto.';
          console.error('Add contact error:', err);
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => { this.previewUrl = reader.result; };
      reader.readAsDataURL(file);
    }
  }

  onUploadContactImage(contactId: number | null | undefined): void {
    if (!this.selectedFile || !contactId) {
      this.imageErrorMessage = 'Por favor, selecciona un archivo.';
      return;
    }

    this.uploadingImage = true;
    this.imageErrorMessage = '';

    this.contactService.updateContactImage(contactId, this.selectedFile).subscribe({
      next: () => {
        this.uploadingImage = false;
        this.onContactAdded.emit(); // Reload contacts to show new image
        this.cancelAddContact(); // Close and reset form completely
      },
      error: (err) => {
        this.uploadingImage = false;
        this.imageErrorMessage = 'Error al subir la imagen.';
        console.error('Upload contact image error:', err);
      }
    });
  }

  cancelImageUpload(): void {
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

  