import { Component, OnInit, OnDestroy } from '@angular/core';
import { Proyecto, ProyectoDto } from 'src/app/models/project.model'; // Import Proyecto, ProyectoDto
import { ProyectoService } from 'src/app/core/services/project.service';
import { Observable, Subscription } from 'rxjs'; // Added Observable
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';
import { HttpErrorResponse } from '@angular/common/http'; // Added HttpErrorResponse

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Proyecto[] | undefined; // Reverted to Proyecto[]
  isLoading: boolean = false;
  errorMessage: string | undefined;
  private projectsSubscription: Subscription | undefined;
  private readonly PUBLIC_PERSONA_ID = 1;
  backendUrl: string;

  showAddProjectForm = false;
  newProject: Proyecto = { nombre: '', descripcion: '', url: '', inicio: '', fin: '' };
  savedProjectId: number | null = null;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  uploadingImage: boolean = false;
  imageErrorMessage: string = '';
  editingProjectId: number | null = null;

  constructor(
    private proyectoService: ProyectoService,
    public authService: AuthService
  ) {
    this.backendUrl = environment.backendUrl;
  }

  ngOnInit(): void {
    this.loadProjectData();
  }

  editProject(project: Proyecto): void {
    if (project.id_proyecto) {
      this.editingProjectId = project.id_proyecto;
      // Create a copy to avoid modifying the original object in the list
      this.newProject = { ...project };
      this.showAddProjectForm = true; // Open the main form
      this.cancelImageUpload(); // Reset any lingering image previews
      this.errorMessage = undefined; // Clear any previous errors
    } else {
      console.error('No se puede editar un proyecto sin ID.');
    }
  }

  deleteProject(project: Proyecto): void {
    if (!project.id_proyecto) {
      console.error('No se puede eliminar un proyecto sin ID.');
      this.errorMessage = 'No se puede eliminar un proyecto sin ID.';
      return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.nombre}"?`)) {
      this.isLoading = true;
      this.errorMessage = undefined; // Clear previous error messages

      this.proyectoService.deleteProyecto(project.id_proyecto).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadProjectData(); // Refresh the project list
          console.log(`Proyecto "${project.nombre}" eliminado con éxito.`);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = `Error al eliminar el proyecto "${project.nombre}": ${err.message || 'Error desconocido'}`;
          console.error('Delete project error:', err);
        }
      });
    }
  }

  loadProjectData(): void {
    this.isLoading = true;
    this.errorMessage = undefined;
    this.projectsSubscription = this.proyectoService.getProyectoByPersonaId(this.PUBLIC_PERSONA_ID).subscribe({
      next: (data: ProyectoDto[]) => { // Service returns ProyectoDto[]
        this.projects = data; // Assigned directly, TypeScript's structural typing handles it
        this.isLoading = false;
        console.log('Proyectos cargados desde el servidor:');
        console.log(this.projects);
        data.forEach(project => {
          console.log(`  Proyecto: ${project.nombre}, Logo: ${project.logo_proyecto}`);
        });
      },
      error: (error) => {
        this.errorMessage = `Error al cargar los datos de proyectos: ${error.message}`;
        this.isLoading = false;
        console.error('Error en ProjectsComponent al cargar datos:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
  }

  toggleAddProjectForm(): void {
    this.showAddProjectForm = !this.showAddProjectForm;
    if (!this.showAddProjectForm) {
      this.cancelAddProject();
    } else {
      this.newProject = { nombre: '', descripcion: '', url: '', inicio: '', fin: '' };
      this.newProject.persona = { id_persona: this.PUBLIC_PERSONA_ID };
      this.savedProjectId = null;
      this.editingProjectId = null;
      this.errorMessage = undefined;
      this.cancelImageUpload();
    }
  }

  cancelAddProject(): void {
    this.showAddProjectForm = false;
    this.newProject = { nombre: '', descripcion: '', url: '', inicio: '', fin: '' };
    this.savedProjectId = null;
    this.editingProjectId = null;
    this.errorMessage = undefined;
    this.cancelImageUpload();
    this.loadProjectData();
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

  onSaveProject(): void {
    if (!this.newProject.nombre || !this.newProject.descripcion || !this.newProject.inicio) {
      this.errorMessage = 'Nombre, descripción y fecha de inicio son obligatorios.';
      return;
    }

    // Ensure persona ID is set before saving/updating
    if (!this.newProject.persona || !this.newProject.persona.id_persona) {
      this.newProject.persona = { id_persona: this.PUBLIC_PERSONA_ID };
    }

    this.isLoading = true;
    this.errorMessage = undefined;

    let saveUpdateObservable: Observable<ProyectoDto>;

    if (this.editingProjectId) {
      // UPDATE existing project
      // Ensure id_proyecto is present for update
      if (this.newProject.id_proyecto === undefined) {
        this.errorMessage = 'Error: ID de proyecto no definido para actualización.';
        this.isLoading = false;
        return;
      }
      saveUpdateObservable = this.proyectoService.updateProyecto(this.editingProjectId, this.newProject);
    } else {
      // CREATE new project
      saveUpdateObservable = this.proyectoService.saveProyecto(this.newProject);
    }

    saveUpdateObservable.subscribe({
      next: (savedProject: ProyectoDto) => { // Added type ProyectoDto
        this.isLoading = false;
        this.savedProjectId = savedProject.id_proyecto || null;
        this.errorMessage = undefined;
        // DO NOT emit here or close the form. The form should stay open for the image upload step.
      },
      error: (err: HttpErrorResponse) => { // Added type HttpErrorResponse
        this.isLoading = false;
        this.errorMessage = `Error al ${this.editingProjectId ? 'actualizar' : 'agregar'} el proyecto: ${err.message}`;
        console.error(`${this.editingProjectId ? 'Update' : 'Add'} project error:`, err);
      }
    });
  }

  onUploadProjectLogo(projectId: number | null | undefined): void {
    if (!this.selectedFile || projectId === null || projectId === undefined) {
      this.imageErrorMessage = 'Por favor, selecciona un archivo y asegúrate de que el proyecto tenga un ID.';
      return;
    }

    this.uploadingImage = true;
    this.imageErrorMessage = '';

    this.proyectoService.uploadProjectLogo(projectId, this.selectedFile).subscribe({
      next: () => {
        this.uploadingImage = false;
        this.loadProjectData();
        this.cancelAddProject(); // Close the form automatically
      },
      error: (err) => {
        this.uploadingImage = false;
        this.imageErrorMessage = `Error al subir la imagen del proyecto: ${err.message || 'Error desconocido'}. Consulta la consola para más detalles.`;
        console.error('ERROR during Project Image Upload:', err);
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
      let baseUrl = this.backendUrl.endsWith('/') ? this.backendUrl : `${this.backendUrl}/`;
      let cleanRelativeUrl = relativeUrl.startsWith('/') ? relativeUrl.substring(1) : relativeUrl;
      return `${baseUrl}${cleanRelativeUrl}`;
    }
    return 'assets/img/icono-de-proyecto-default.webp';
  }
}
