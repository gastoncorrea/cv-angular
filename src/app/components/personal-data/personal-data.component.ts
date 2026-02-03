import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Persona } from 'src/app/models/person.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { PersonaService } from 'src/app/core/services/persona.service'; // Import PersonaService

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent {
  @Input() personalData: Persona | undefined;
  @Output() onUploadSuccess = new EventEmitter<void>(); // Event emitter for success

  backendUrl: string;
  showUploadForm = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private personaService: PersonaService // Inject PersonaService
  ) {
    this.backendUrl = environment.backendUrl;
  }

  editPersona(): void {
    if (this.personalData && this.personalData.id_persona) {
      this.router.navigate(['/persona/edit', this.personalData.id_persona]);
    } else {
      console.error('No personalData or id_persona available for editing.');
    }
  }

  toggleUploadForm(): void {
    this.showUploadForm = !this.showUploadForm;
    if (!this.showUploadForm) {
      this.cancelUpload(); // Reset form if closing
    }
  }

  cancelUpload(): void {
    this.showUploadForm = false;
    this.selectedFile = null;
    this.previewUrl = null;
    this.errorMessage = '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Generate preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onUpload(): void {
    if (!this.selectedFile || !this.personalData || !this.personalData.id_persona) {
      this.errorMessage = 'No se puede subir la imagen. Faltan datos de usuario o el archivo.';
      console.error('Upload cannot proceed: Missing file, personalData, or personalData.id_persona');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.personaService.uploadPersonaImage(this.personalData.id_persona, this.selectedFile).subscribe({
      next: () => {
        this.isLoading = false;
        this.showUploadForm = false;
        this.onUploadSuccess.emit(); // Notify parent to reload data
        this.cancelUpload(); // Reset form state
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al subir la imagen. Por favor, inténtalo de nuevo.';
        console.error('Upload error:', err);
      }
    });
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

  getFullImageUrl(relativeUrl: string | null | undefined): string {
    if (relativeUrl) {
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://') || relativeUrl.startsWith('data:')) {
        return relativeUrl;
      }
      return `${this.backendUrl}${relativeUrl}`;
    }
    return 'assets/img/default-profile.jpg';
  }
}
