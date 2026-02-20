import { Component, OnInit, OnDestroy } from '@angular/core';
import { Educacion, EducacionDto } from 'src/app/models/education.model';
import { EducacionService } from 'src/app/core/services/education.service';
import { HerramientaService } from 'src/app/core/services/tool.service';
import { Herramienta, HerramientaDto, EducacionHerramientasDto, HerramientaRequestDto } from 'src/app/models/tools.model';
import { FormManagementService } from 'src/app/core/services/form-management.service';
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
  private formSubscription: Subscription | undefined;
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

  allTools: HerramientaDto[] = [];
  showAddToolForm = false;
  selectedEducationIdForTool: number | null = null;
  isNewTool = false;
  selectedToolId: number | null = null;
  newTool: Herramienta = { nombre: '', version: '' };
  savedToolId: number | null = null;

  constructor(
    private educationService: EducacionService,
    private herramientaService: HerramientaService,
    private formService: FormManagementService,
    public authService: AuthService
  ) {
    this.backendUrl = environment.backendUrl;
  }

  ngOnInit(): void {
    this.loadEducationData();
    this.loadAllTools();
    this.subscribeToFormService();
  }

  private subscribeToFormService(): void {
    this.formSubscription = this.formService.getOpenFormId().subscribe(openId => {
      if (openId !== 'edu-form' && !openId?.startsWith('edu-tool-')) {
        this.showAddEducationForm = false;
        this.showAddToolForm = false;
      } else if (openId === 'edu-form') {
        this.showAddToolForm = false;
      } else if (openId?.startsWith('edu-tool-')) {
        this.showAddEducationForm = false;
      }
    });
  }

  loadAllTools(): void {
    this.herramientaService.getAllHerramientas().subscribe({
      next: (tools) => this.allTools = tools,
      error: (err) => console.error('Error loading tools:', err)
    });
  }

  isToolAlreadyInEducation(toolId: number): boolean {
    if (!this.selectedEducationIdForTool || !this.education) return false;
    const edu = this.education.find(e => e.id_educacion === this.selectedEducationIdForTool);
    return edu?.herramientas?.some(t => t.id_herramienta === toolId) || false;
  }

  toggleAddToolForm(educationId: number | undefined): void {
    if (!educationId) return;
    const formId = `edu-tool-${educationId}`;
    if (this.selectedEducationIdForTool === educationId && this.showAddToolForm) {
      this.formService.closeAll();
    } else {
      this.formService.openForm(formId);
      this.selectedEducationIdForTool = educationId;
      this.showAddToolForm = true;
      this.resetToolForm();
    }
  }

  resetToolForm(keepMode: boolean = false): void {
    if (!keepMode) {
      this.isNewTool = false;
    }
    this.selectedToolId = null;
    this.newTool = { nombre: '', version: '' };
    this.savedToolId = null;
    this.selectedFile = null;
    this.previewUrl = null;
    this.imageErrorMessage = '';
  }

  onSaveToolToEducation(): void {
    if (!this.selectedEducationIdForTool) return;
    this.isLoading = true;
    if (this.isNewTool) {
      this.herramientaService.saveHerramienta(this.newTool).subscribe({
        next: (savedTool: HerramientaDto) => {
          this.savedToolId = savedTool.id_herramienta;
          this.associateToolToEducation(savedTool.id_herramienta);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = `Error: ${err.message}`;
        }
      });
    } else if (this.selectedToolId) {
      this.associateToolToEducation(this.selectedToolId);
    }
  }

  private associateToolToEducation(toolId: number): void {
    if (!this.selectedEducationIdForTool) return;
    const payload: EducacionHerramientasDto = {
      educacionId: this.selectedEducationIdForTool,
      herramientas: [{ id: toolId }]
    };
    this.educationService.addHerramientasToEducacion(payload).subscribe({
      next: () => {
        if (this.isNewTool && this.selectedFile && this.savedToolId) {
          this.uploadToolLogoAndFinish(this.savedToolId);
        } else {
          this.finishToolAddition();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Error: ${err.message}`;
      }
    });
  }

  private uploadToolLogoAndFinish(toolId: number): void {
    if (!this.selectedFile) return;
    this.herramientaService.uploadToolLogo(toolId, this.selectedFile).subscribe({
      next: () => this.finishToolAddition(),
      error: (err) => {
        this.isLoading = false;
        this.finishToolAddition();
      }
    });
  }

  private finishToolAddition(): void {
    this.isLoading = false;
    this.showAddToolForm = false;
    this.selectedEducationIdForTool = null;
    this.formService.closeAll();
    this.loadEducationData();
    this.loadAllTools();
  }

  editEducation(edu: Educacion): void {
    if (edu.id_educacion) {
      this.formService.openForm('edu-form');
      this.editingEducationId = edu.id_educacion;
      this.newEducation = { ...edu };
      this.showAddEducationForm = true;
      this.cancelImageUpload();
    }
  }

  deleteEducation(edu: Educacion): void {
    if (!edu.id_educacion) return;
    if (confirm(`¿Estás seguro?`)) {
      this.isLoading = true;
      this.educationService.deleteEducacion(edu.id_educacion).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadEducationData();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = `Error: ${err.message}`;
        }
      });
    }
  }

  editToolFromEducation(tool: Herramienta, educationId: number | undefined): void {
    if (!educationId) return;
    this.formService.openForm(`edu-tool-${educationId}`);
    this.selectedEducationIdForTool = educationId;
    this.showAddToolForm = true;
    this.isNewTool = true;
    this.newTool = { ...tool };
  }

  removeToolFromEducation(tool: Herramienta, educationId: number | undefined): void {
    if (!educationId || !tool.id_herramienta) return;
    this.isLoading = true;
    this.educationService.deleteHerramientaFromEducacion(educationId, tool.id_herramienta).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadEducationData();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Error: ${err.message}`;
      }
    });
  }

  loadEducationData(): void {
    this.isLoading = true;
    this.educationSubscription = this.educationService.getEducacionByPersonaId(this.PUBLIC_PERSONA_ID).subscribe({
      next: (data) => {
        this.education = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = `Error: ${error.message}`;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.educationSubscription) this.educationSubscription.unsubscribe();
    if (this.formSubscription) this.formSubscription.unsubscribe();
  }

  toggleAddEducationForm(): void {
    this.showAddEducationForm = !this.showAddEducationForm;
    if (!this.showAddEducationForm) {
      this.formService.closeAll();
    } else {
      this.formService.openForm('edu-form');
      this.newEducation = { nombre_institucion: '', logo_imagen: '', fecha_inicio: '', fecha_fin: '', titulo: '', url_titulo: '' };
      this.newEducation.persona = { id_persona: this.PUBLIC_PERSONA_ID };
      this.savedEducationId = null;
      this.editingEducationId = null;
      this.cancelImageUpload();
    }
  }

  cancelAddEducation(): void {
    this.showAddEducationForm = false;
    this.formService.closeAll();
    this.loadEducationData();
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

  onSaveEducation(): void {
    if (!this.newEducation.nombre_institucion || !this.newEducation.titulo || !this.newEducation.fecha_inicio) return;
    this.isLoading = true;
    let obs = this.editingEducationId 
      ? this.educationService.updateEducacion(this.editingEducationId, this.newEducation)
      : this.educationService.saveEducacion(this.newEducation);
    obs.subscribe({
      next: (saved) => {
        this.isLoading = false;
        this.savedEducationId = saved.id_educacion || null;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Error: ${err.message}`;
      }
    });
  }

  onUploadEducationLogo(educationId: number | null | undefined): void {
    if (!this.selectedFile || !educationId) return;
    this.uploadingImage = true;
    this.educationService.uploadEducationLogo(educationId, this.selectedFile).subscribe({
      next: () => {
        this.uploadingImage = false;
        this.cancelAddEducation();
      },
      error: (err) => {
        this.uploadingImage = false;
        this.imageErrorMessage = `Error: ${err.message}`;
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
      if (relativeUrl.startsWith('http') || relativeUrl.startsWith('data:')) return relativeUrl;
      return `${this.backendUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl.startsWith('uploads/') ? '' : 'uploads/'}${relativeUrl}`;
    }
    return 'assets/img/logo_default_education.jpg';
  }
}
