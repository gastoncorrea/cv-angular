import { Component, OnInit, OnDestroy } from '@angular/core';
import { Proyecto } from 'src/app/models/project.model'; // Import Proyecto
import { ProyectoService } from 'src/app/core/services/project.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service'; // Import AuthService

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Proyecto[] | undefined;
  isLoading: boolean = false;
  errorMessage: string | undefined;
  private projectsSubscription: Subscription | undefined;
  private readonly PUBLIC_PERSONA_ID = 1; // Assuming a fixed ID for the public persona profile
  backendUrl: string; // Declare backendUrl property

  showAddProjectForm = false; // Control form visibility
  newProject: Proyecto = { nombre: '', descripcion: '', url: '', inicio: '', fin: '' };
  savedProjectId: number | null = null; // For two-step form (text then image)
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  uploadingImage: boolean = false;
  imageErrorMessage: string = '';
  editingProjectId: number | null = null; // For future edit functionality

  constructor(
    private proyectoService: ProyectoService,
    public authService: AuthService // Inject AuthService
  ) {
    this.backendUrl = environment.backendUrl; // Initialize in constructor
  }

  ngOnInit(): void {
    this.loadProjectData();
  }

  editProject(project: Proyecto): void {
    console.log('Edit project:', project);
    // Future implementation: Navigate to edit form or open modal
  }

  deleteProject(project: Proyecto): void {
    console.log('Delete project:', project);
    // Future implementation: Confirmation dialog and then call service to delete
  }

  loadProjectData(): void {
    this.isLoading = true;
    this.errorMessage = undefined;
    this.projectsSubscription = this.proyectoService.getProyectoByPersonaId(this.PUBLIC_PERSONA_ID).subscribe({
      next: (data: Proyecto[]) => {
        this.projects = data;
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
      this.cancelAddProject(); // Reset form if closing
    } else {
      // Initialize newProject with personaId when opening the form
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
    this.loadProjectData(); // Refresh list in case of cancelled create/edit where image was not uploaded
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

    if (!this.newProject.persona || !this.newProject.persona.id_persona) {
      this.errorMessage = 'No se puede agregar el proyecto sin el ID de la persona.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = undefined;

    this.proyectoService.saveProyecto(this.newProject).subscribe({
      next: (savedProject) => {
        this.isLoading = false;
        this.savedProjectId = savedProject.id_proyecto || null;
        this.errorMessage = undefined;
        // Do NOT call loadProjectData() here. Form should stay open for image upload.
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Error al agregar el proyecto: ${err.message}`;
        console.error('Add project error:', err);
      }
    });
  }

  onUploadProjectImage(projectId: number | null | undefined): void {
    if (!this.selectedFile || !projectId) {
      this.imageErrorMessage = 'Por favor, selecciona un archivo y asegúrate de que el proyecto tenga un ID.';
      return;
    }

    this.uploadingImage = true;
    this.imageErrorMessage = '';

          this.proyectoService.uploadProjectImage(projectId, this.selectedFile).subscribe({
            next: () => {
              this.uploadingImage = false;
              // Temporarily removed cancelAddProject() to keep form open on success for debugging
              // this.cancelAddProject(); // Close and reset form, also reloads project data
              this.loadProjectData(); // Refresh data explicitly
              this.imageErrorMessage = 'Logo subido con éxito. Puedes cerrar el formulario manualmente.'; // Provide success feedback
            },
            error: (err) => {
              this.uploadingImage = false;
              this.imageErrorMessage = `Error al subir la imagen del proyecto: ${err.message || 'Error desconocido'}. Consulta la consola para más detalles.`;
              console.error('ERROR during Project Image Upload:', err); // More prominent error logging
            }
          });  }

  cancelImageUpload(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.imageErrorMessage = '';
  }

  // Method to construct the full image URL
  getFullImageUrl(relativeUrl: string | null | undefined): string {
    if (relativeUrl && relativeUrl.trim() !== '') {
      // Check if the relativeUrl is already an absolute URL or a data URL
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://') || relativeUrl.startsWith('data:')) {
        return relativeUrl;
      }

      // Ensure backendUrl ends with a single slash
      let baseUrl = this.backendUrl.endsWith('/') ? this.backendUrl : `${this.backendUrl}/`;
      
      // Ensure relativeUrl does not start with a slash (if it does, remove it)
      let cleanRelativeUrl = relativeUrl.startsWith('/') ? relativeUrl.substring(1) : relativeUrl;

      return `${baseUrl}${cleanRelativeUrl}`;
    }
    return 'assets/img/icono-de-proyecto-default.webp'; // Return default image if no valid project image URL
  }
}
