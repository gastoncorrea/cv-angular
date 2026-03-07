import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Proyecto, ProyectoDto } from 'src/app/models/project.model';
import { ProyectoService } from 'src/app/core/services/project.service';
import { HerramientaService } from 'src/app/core/services/tool.service';
import { Herramienta, HerramientaDto, ProyectoHerramientasDto, HerramientaRequestDto } from 'src/app/models/tools.model';
import { FormManagementService } from 'src/app/core/services/form-management.service';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataRefreshService } from 'src/app/core/services/data-refresh.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() personaId: number | undefined;
  projects: Proyecto[] | undefined;
  isLoading: boolean = false;
  errorMessage: string | undefined;
  private projectsSubscription: Subscription | undefined;
  private formSubscription: Subscription | undefined;
  backendUrl: string;

  showAddProjectForm = false;
  newProject: Proyecto = { nombre: '', descripcion: '', url: '', inicio: '', fin: '' };
  savedProjectId: number | null = null;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  uploadingImage: boolean = false;
  imageErrorMessage: string = '';
  editingProjectId: number | null = null;

  allTools: HerramientaDto[] = [];
  showAddToolForm = false;
  selectedProjectIdForTool: number | null = null;
  isNewTool = false;
  selectedToolId: number | null = null;
  newTool: Herramienta = { nombre: '', version: '' };
  savedToolId: number | null = null;

  constructor(
    private proyectoService: ProyectoService,
    private herramientaService: HerramientaService,
    private formService: FormManagementService,
    public authService: AuthService,
    private refreshService: DataRefreshService
  ) {
    this.backendUrl = environment.backendUrl;
  }

  ngOnInit(): void {
    if (this.personaId) {
      this.loadProjectData();
    }
    this.loadAllTools();
    this.subscribeToFormService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personaId'] && !changes['personaId'].firstChange) {
      this.loadProjectData();
    }
  }

  private subscribeToFormService(): void {
    this.formSubscription = this.formService.getOpenFormId().subscribe(openId => {
      if (openId !== 'project-form' && !openId?.startsWith('project-tool-')) {
        this.showAddProjectForm = false;
        this.showAddToolForm = false;
      } else if (openId === 'project-form') {
        this.showAddToolForm = false;
      } else if (openId?.startsWith('project-tool-')) {
        this.showAddProjectForm = false;
      }
    });
  }

  loadAllTools(): void {
    this.herramientaService.getAllHerramientas().subscribe({
      next: (tools) => this.allTools = tools,
      error: (err) => console.error('Error loading tools:', err)
    });
  }

  isToolAlreadyInProject(toolId: number): boolean {
    if (!this.selectedProjectIdForTool || !this.projects) return false;
    const project = this.projects.find(p => p.id_proyecto === this.selectedProjectIdForTool);
    return project?.herramientas?.some(t => t.id_herramienta === toolId) || false;
  }

  toggleAddToolForm(projectId: number | undefined): void {
    if (!projectId) return;
    const formId = `project-tool-${projectId}`;
    if (this.selectedProjectIdForTool === projectId && this.showAddToolForm) {
      this.formService.closeAll();
    } else {
      this.formService.openForm(formId);
      this.selectedProjectIdForTool = projectId;
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

  onSaveToolToProject(): void {
    if (!this.selectedProjectIdForTool) return;
    this.isLoading = true;
    this.errorMessage = undefined;
    if (this.isNewTool) {
      this.herramientaService.saveHerramienta(this.newTool).subscribe({
        next: (savedTool: HerramientaDto) => {
          this.savedToolId = savedTool.id_herramienta;
          this.associateToolToProject(savedTool.id_herramienta);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = `Error al crear la herramienta: ${err.message}`;
        }
      });
    } else if (this.selectedToolId) {
      this.associateToolToProject(this.selectedToolId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Debe seleccionar una herramienta o crear una nueva.';
    }
  }

  private associateToolToProject(toolId: number): void {
    if (!this.selectedProjectIdForTool) return;
    const herramientaReq: HerramientaRequestDto = { id: toolId };
    const payload: ProyectoHerramientasDto = {
      proyectoId: this.selectedProjectIdForTool,
      herramientas: [herramientaReq]
    };
    this.proyectoService.addHerramientasToProyecto(payload).subscribe({
      next: () => {
        if (this.isNewTool && this.selectedFile && this.savedToolId) {
          this.uploadToolLogoAndFinish(this.savedToolId);
        } else {
          this.finishToolAddition();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Error al asociar la herramienta al proyecto: ${err.message}`;
      }
    });
  }

  private uploadToolLogoAndFinish(toolId: number): void {
    if (!this.selectedFile) return;
    this.herramientaService.uploadToolLogo(toolId, this.selectedFile).subscribe({
      next: () => this.finishToolAddition(),
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Herramienta asociada, pero hubo un error al subir el logo: ${err.message}`;
        this.finishToolAddition();
      }
    });
  }

  private finishToolAddition(): void {
    this.isLoading = false;
    this.showAddToolForm = false;
    this.selectedProjectIdForTool = null;
    this.formService.closeAll();
    this.loadProjectData();
    this.loadAllTools();
    this.refreshService.triggerSkillsRefresh();
  }

  editProject(project: Proyecto): void {
    if (project.id_proyecto) {
      this.formService.openForm('project-form');
      this.editingProjectId = project.id_proyecto;
      this.newProject = { ...project };
      this.showAddProjectForm = true;
      this.cancelImageUpload();
      this.errorMessage = undefined;
    }
  }

  deleteProject(project: Proyecto): void {
    if (!project.id_proyecto) return;
    if (confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.nombre}"?`)) {
      this.isLoading = true;
      this.proyectoService.deleteProyecto(project.id_proyecto).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadProjectData();
          this.refreshService.triggerSkillsRefresh();
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = `Error al eliminar el proyecto: ${err.message}`;
        }
      });
    }
  }

  editToolFromProject(tool: Herramienta, projectId: number | undefined): void {
    if (!projectId) return;
    this.formService.openForm(`project-tool-${projectId}`);
    this.selectedProjectIdForTool = projectId;
    this.showAddToolForm = true;
    this.isNewTool = true;
    this.newTool = { ...tool };
  }

  removeToolFromProject(tool: Herramienta, projectId: number | undefined): void {
    if (!projectId || !tool.id_herramienta) return;
    this.isLoading = true;
    this.proyectoService.deleteHerramientaFromProyecto(projectId, tool.id_herramienta).subscribe({
      next: () => {
        this.isLoading = false;
        this.loadProjectData();
        this.refreshService.triggerSkillsRefresh();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Error al desvincular la herramienta: ${err.message}`;
      }
    });
  }

  loadProjectData(): void {
    if (!this.personaId) return;
    this.isLoading = true;
    this.projectsSubscription = this.proyectoService.getProyectoByPersonaId(this.personaId).subscribe({
      next: (data: ProyectoDto[]) => {
        this.projects = data.reverse();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Error al cargar los datos de proyectos: ${error.message}`;
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.projectsSubscription) this.projectsSubscription.unsubscribe();
    if (this.formSubscription) this.formSubscription.unsubscribe();
  }

  toggleAddProjectForm(): void {
    this.showAddProjectForm = !this.showAddProjectForm;
    if (!this.showAddProjectForm) {
      this.formService.closeAll();
    } else {
      this.formService.openForm('project-form');
      this.newProject = { nombre: '', descripcion: '', url: '', inicio: '', fin: '' };
      if (this.personaId) {
        this.newProject.persona = { id_persona: this.personaId };
      }
      this.savedProjectId = null;
      this.editingProjectId = null;
      this.cancelImageUpload();
    }
  }

  cancelAddProject(): void {
    this.showAddProjectForm = false;
    this.formService.closeAll();
    this.loadProjectData();
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

  onSaveProject(): void {
    if (!this.newProject.nombre || !this.newProject.descripcion || !this.newProject.inicio) return;
    this.isLoading = true;
    let obs = this.editingProjectId 
      ? this.proyectoService.updateProyecto(this.editingProjectId, this.newProject)
      : this.proyectoService.saveProyecto(this.newProject);
    obs.subscribe({
      next: (saved: ProyectoDto) => {
        this.isLoading = false;
        this.savedProjectId = saved.id_proyecto || null;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Error al guardar: ${err.message}`;
      }
    });
  }

  onUploadProjectLogo(projectId: number | null | undefined): void {
    if (!this.selectedFile || !projectId) return;
    this.uploadingImage = true;
    this.proyectoService.uploadProjectLogo(projectId, this.selectedFile).subscribe({
      next: () => {
        this.uploadingImage = false;
        this.cancelAddProject();
      },
      error: (err) => {
        this.uploadingImage = false;
        this.imageErrorMessage = `Error al subir logo: ${err.message}`;
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
      return `${this.backendUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
    }
    return 'assets/img/icono-de-proyecto-default.webp';
  }
}
