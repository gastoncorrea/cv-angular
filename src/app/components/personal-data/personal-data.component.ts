import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Persona, PersonaDto } from 'src/app/models/person.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';
import { PersonaService } from 'src/app/core/services/persona.service';
import { ResidenceService } from 'src/app/core/services/residence.service';
import { FormManagementService } from 'src/app/core/services/form-management.service';
import { Subscription, forkJoin, of, Observable } from 'rxjs';
import { Residencia } from 'src/app/models/residence.model';

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
  private deletedResidenceIds: number[] = [];

  constructor(
    public authService: AuthService,
    private personaService: PersonaService,
    private residenceService: ResidenceService,
    public formService: FormManagementService,
    private fb: FormBuilder
  ) {
    this.backendUrl = environment.backendUrl;
    this.personaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      profesion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      descripcion_mi: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(700)]],
      fecha_nacimiento: ['', Validators.required],
      num_celular: ['', [Validators.required, Validators.pattern(/^[+]?[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4,6}$/)]],
      residencias: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.subscribeToFormService();
  }

  get residencias(): FormArray {
    return this.personaForm.get('residencias') as FormArray;
  }

  addResidence(): void {
    const residenceGroup = this.fb.group({
      id_residencia: [null],
      localidad: ['', [Validators.required, Validators.minLength(2)]],
      provincia: ['', [Validators.required, Validators.minLength(2)]],
      pais: ['', [Validators.required, Validators.minLength(2)]],
      nacionalidad: ['', [Validators.required, Validators.minLength(2)]]
    });
    this.residencias.push(residenceGroup);
  }

  removeResidence(index: number): void {
    const residence = this.residencias.at(index).value;
    if (residence.id_residencia) {
      this.deletedResidenceIds.push(residence.id_residencia);
    }
    this.residencias.removeAt(index);
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
      this.deletedResidenceIds = [];
      
      // Clear and populate residencias FormArray
      while (this.residencias.length !== 0) {
        this.residencias.removeAt(0);
      }
      
      if (this.personalData.residencias && this.personalData.residencias.length > 0) {
        this.personalData.residencias.forEach(res => {
          this.residencias.push(this.fb.group({
            id_residencia: [res.id_residencia],
            localidad: [res.localidad, [Validators.required, Validators.minLength(2)]],
            provincia: [res.provincia, [Validators.required, Validators.minLength(2)]],
            pais: [res.pais, [Validators.required, Validators.minLength(2)]],
            nacionalidad: [res.nacionalidad, [Validators.required, Validators.minLength(2)]]
          }));
        });
      }

      this.personaForm.patchValue({
        nombre: this.personalData.nombre,
        apellido: this.personalData.apellido,
        profesion: this.personalData.profesion,
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
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // 1. Prepare Persona Data (without residences array for the persona update itself, 
    // to avoid potential conflicts if the backend doesn't handle nested updates)
    const { residencias, ...personaData } = this.personaForm.value;
    const personaDto: PersonaDto = {
      ...personaData,
      id_persona: this.personalData.id_persona
    };

    // 2. Perform updates in sequence or parallel using forkJoin
    const personaUpdate$ = this.personaService.updatePersona(this.personalData.id_persona, personaDto);
    
    // 3. Handle residences: Save new ones, update existing ones, and delete removed ones
    const ops: Observable<any>[] = [];

    // Save/Update operations
    const currentResidencias: Residencia[] = residencias.map((res: any) => ({
      ...res,
      persona: { id_persona: this.personalData!.id_persona! }
    }));

    currentResidencias.forEach(res => {
      if (res.id_residencia) {
        ops.push(this.residenceService.updateResidence(res.id_residencia, res));
      } else {
        ops.push(this.residenceService.saveResidence(res));
      }
    });

    // Delete operations
    this.deletedResidenceIds.forEach(id => {
      ops.push(this.residenceService.deleteResidence(id));
    });

    // 4. Combine all operations
    forkJoin([
      personaUpdate$,
      ...(ops.length > 0 ? ops : [of(null)])
    ]).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Información personal y residencias actualizadas con éxito.';
        this.onUploadSuccess.emit();
        setTimeout(() => this.formService.closeAll(), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al actualizar la información. Verifique los datos.';
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
