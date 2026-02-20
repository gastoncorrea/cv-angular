import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Persona, PersonaDto } from 'src/app/models/person.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';
import { PersonaService } from 'src/app/core/services/persona.service';
import { FormManagementService } from 'src/app/core/services/form-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit, OnDestroy {
  @Input() personalData: Persona | undefined;
  @Output() onUploadSuccess = new EventEmitter<void>();

  backendUrl: string;
  showUploadForm = false;
  showEditForm = false;
  
  personaForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private formSubscription: Subscription | undefined;

  constructor(
    public authService: AuthService,
    private personaService: PersonaService,
    public formService: FormManagementService,
    private fb: FormBuilder
  ) {
    this.backendUrl = environment.backendUrl;
    this.personaForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      descripcion_mi: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      num_celular: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.subscribeToFormService();
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  private subscribeToFormService(): void {
    this.formSubscription = this.formService.getOpenFormId().subscribe(openId => {
      if (openId !== 'persona-edit-form' && openId !== 'persona-upload-form') {
        this.showEditForm = false;
        this.showUploadForm = false;
      } else if (openId === 'persona-edit-form') {
        this.showUploadForm = false;
      } else if (openId === 'persona-upload-form') {
        this.showEditForm = false;
      }
    });
  }

  editPersona(): void {
    if (this.personalData) {
      this.formService.openForm('persona-edit-form');
      this.showEditForm = true;
      this.personaForm.patchValue({
        nombre: this.personalData.nombre,
        apellido: this.personalData.apellido,
        descripcion_mi: this.personalData.descripcion_mi,
        fecha_nacimiento: this.personalData.fecha_nacimiento,
        num_celular: this.personalData.num_celular
      });
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  onSavePersona(): void {
    if (this.personaForm.invalid || !this.personalData?.id_persona) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updatedPersona: PersonaDto = {
      ...this.personaForm.value,
      id_persona: this.personalData.id_persona
    };

    this.personaService.updatePersona(this.personalData.id_persona, updatedPersona).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Información personal actualizada con éxito.';
        this.onUploadSuccess.emit(); // Reutilizamos el evento para recargar datos
        setTimeout(() => this.formService.closeAll(), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al actualizar la información personal.';
        console.error('Update error:', err);
      }
    });
  }

  cancelEdit(): void {
    this.formService.closeAll();
  }

  toggleUploadForm(): void {
    if (this.showUploadForm) {
      this.formService.closeAll();
    } else {
      this.formService.openForm('persona-upload-form');
      this.showUploadForm = true;
      this.cancelUpload();
    }
  }

  cancelUpload(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.errorMessage = '';
    if (this.showUploadForm) {
        // No cerramos el servicio aquí si solo estamos reseteando campos internos
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

  onUpload(): void {
    if (!this.selectedFile || !this.personalData?.id_persona) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.personaService.uploadPersonaImage(this.personalData.id_persona, this.selectedFile).subscribe({
      next: () => {
        this.isLoading = false;
        this.onUploadSuccess.emit();
        this.formService.closeAll();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al subir la imagen.';
      }
    });
  }

  calculateAge(birthdateString: string): number {
    if (!birthdateString) return 0;
    const birthdate = new Date(birthdateString);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) age--;
    return age;
  }

  getFullImageUrl(relativeUrl: string | null | undefined): string {
    if (relativeUrl) {
      if (relativeUrl.startsWith('http') || relativeUrl.startsWith('data:')) return relativeUrl;
      return `${this.backendUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
    }
    return 'assets/img/default-profile.svg';
  }
}
