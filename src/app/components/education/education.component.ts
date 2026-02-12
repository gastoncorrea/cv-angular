import { Component, OnInit, OnDestroy } from '@angular/core';
import { Educacion, EducacionDto } from 'src/app/models/education.model';
import { EducacionService } from 'src/app/core/services/education.service';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit, OnDestroy {
  education: Educacion[] | undefined;
  isLoading: boolean = false;
  errorMessage: string | undefined;
  private educationSubscription: Subscription | undefined;
  private readonly PUBLIC_PERSONA_ID = 1;
  backendUrl: string;

  showAddEducationForm = false;
  newEducation: Educacion = { nombre_institucion: '', logo_imagen: '', fecha_inicio: '', fecha_fin: '', titulo: '', url_titulo: '' };
  savedEducationId: number | null = null;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  uploadingImage: boolean = false;
  imageErrorMessage: string = '';
  editingEducationId: number | null = null;

  constructor(
    private educationService: EducacionService,
    public authService: AuthService
  ) {
    this.backendUrl = environment.backendUrl;
  }

  ngOnInit(): void {
    this.loadEducationData();
  }

  editEducation(edu: Educacion): void {
    if (edu.id_educacion) {
      this.editingEducationId = edu.id_educacion;
      this.newEducation = { ...edu };
      this.showAddEducationForm = true;
      this.cancelImageUpload();
      this.errorMessage = undefined;
    } else {
      console.error('No se puede editar una entrada de educación sin ID.');
    }
  }

  deleteEducation(edu: Educacion): void {
    if (!edu.id_educacion) {
      console.error('No se puede eliminar una entrada de educación sin ID.');
      this.errorMessage = 'No se puede eliminar una entrada de educación sin ID.';
      return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar la entrada "${edu.titulo}"?`)) {
      this.isLoading = true;
      this.errorMessage = undefined;

      this.educationService.deleteEducacion(edu.id_educacion).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadEducationData();
          console.log(`Entrada de educación "${edu.titulo}" eliminada con éxito.`);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = `Error al eliminar la entrada "${edu.titulo}": ${err.message || 'Error desconocido'}`;
          console.error('Delete education error:', err);
        }
      });
    }
  }

  loadEducationData(): void {
    this.isLoading = true;
    this.errorMessage = undefined;
    this.educationSubscription = this.educationService.getEducacionByPersonaId(this.PUBLIC_PERSONA_ID).subscribe({
      next: (data: EducacionDto[]) => {
        this.education = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Error al cargar los datos de educación: ${error.message}`;
        this.isLoading = false;
        console.error('Error en EducationComponent al cargar datos:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.educationSubscription) {
      this.educationSubscription.unsubscribe();
    }
  }

  toggleAddEducationForm(): void {
    this.showAddEducationForm = !this.showAddEducationForm;
    if (!this.showAddEducationForm) {
      this.cancelAddEducation();
    } else {
      this.newEducation = { nombre_institucion: '', logo_imagen: '', fecha_inicio: '', fecha_fin: '', titulo: '', url_titulo: '' };
      this.newEducation.persona = { id_persona: this.PUBLIC_PERSONA_ID };
      this.savedEducationId = null;
      this.editingEducationId = null;
      this.errorMessage = undefined;
      this.cancelImageUpload();
    }
  }

  cancelAddEducation(): void {
    this.showAddEducationForm = false;
    this.newEducation = { nombre_institucion: '', logo_imagen: '', fecha_inicio: '', fecha_fin: '', titulo: '', url_titulo: '' };
    this.savedEducationId = null;
    this.editingEducationId = null;
    this.errorMessage = undefined;
    this.cancelImageUpload();
    this.loadEducationData();
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

  onSaveEducation(): void {
    if (!this.newEducation.nombre_institucion || !this.newEducation.titulo || !this.newEducation.fecha_inicio) {
      this.errorMessage = 'Nombre de la institución, título y fecha de inicio son obligatorios.';
      return;
    }

    if (!this.newEducation.persona || !this.newEducation.persona.id_persona) {
      this.newEducation.persona = { id_persona: this.PUBLIC_PERSONA_ID };
    }

    this.isLoading = true;
    this.errorMessage = undefined;

    let saveUpdateObservable: Observable<EducacionDto>;

    if (this.editingEducationId) {
      if (this.newEducation.id_educacion === undefined) {
        this.errorMessage = 'Error: ID de educación no definido para actualización.';
        this.isLoading = false;
        return;
      }
      saveUpdateObservable = this.educationService.updateEducacion(this.editingEducationId, this.newEducation);
    } else {
      saveUpdateObservable = this.educationService.saveEducacion(this.newEducation);
    }

    saveUpdateObservable.subscribe({
      next: (savedEducation: EducacionDto) => {
        this.isLoading = false;
        this.savedEducationId = savedEducation.id_educacion || null;
        this.errorMessage = undefined;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = `Error al ${this.editingEducationId ? 'actualizar' : 'agregar'} la entrada de educación: ${err.message}`;
        console.error(`${this.editingEducationId ? 'Update' : 'Add'} education error:`, err);
      }
    });
  }

  onUploadEducationLogo(educationId: number | null | undefined): void {
    if (!this.selectedFile || educationId === null || educationId === undefined) {
      this.imageErrorMessage = 'Por favor, selecciona un archivo y asegúrate de que la entrada de educación tenga un ID.';
      return;
    }

    this.uploadingImage = true;
    this.imageErrorMessage = '';

    this.educationService.uploadEducationLogo(educationId, this.selectedFile).subscribe({
      next: () => {
        this.uploadingImage = false;
        this.loadEducationData();
        this.cancelAddEducation();
      },
      error: (err: HttpErrorResponse) => { // Explicitly type err for better type checking
        this.uploadingImage = false;
        console.error('ERROR during Education Image Upload (raw):', err); // Log the raw error
        // Attempt to extract a user-friendly message from the error object
        let userFriendlyMessage = 'Error desconocido al subir la imagen.';
        if (err instanceof HttpErrorResponse) {
          if (typeof err.error === 'string') {
            try {
              const parsedError = JSON.parse(err.error);
              userFriendlyMessage = parsedError.error || err.message || userFriendlyMessage;
            } catch (e) {
              userFriendlyMessage = err.error || err.message || userFriendlyMessage;
            }
          } else if (err.error && err.error.message) {
            userFriendlyMessage = err.error.message;
          } else if (err.message) {
            userFriendlyMessage = err.message;
          }
        }
        this.imageErrorMessage = `Error al subir la imagen: ${userFriendlyMessage}`;
        console.error('ERROR during Education Image Upload (processed):', this.imageErrorMessage);
      }
    });
  }

  cancelImageUpload(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.imageErrorMessage = '';
  }

  getFullImageUrl(relativeUrl: string | null | undefined): string {
    if (relativeUrl && relativeUrl.trim() !== '') {
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://') || relativeUrl.startsWith('data:')) {
        return relativeUrl;
      }
      // Assuming images are served from /uploads/ relative to the backend URL
      let baseUrl = this.backendUrl.endsWith('/') ? this.backendUrl : `${this.backendUrl}/`;
      let cleanRelativeUrl = relativeUrl.startsWith('/') ? relativeUrl.substring(1) : relativeUrl;
      
      // Add /uploads/ prefix if not already present
      if (!cleanRelativeUrl.startsWith('uploads/')) {
        cleanRelativeUrl = `uploads/${cleanRelativeUrl}`;
      }
      return `${baseUrl}${cleanRelativeUrl}`;
    }
    return 'assets/img/logo_default_education.jpg';
  }
}
