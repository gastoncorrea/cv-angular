import { Component, OnInit, OnDestroy } from '@angular/core';
import { Proyecto } from 'src/app/models/project.model'; // Import Proyecto
import { ProyectoService } from 'src/app/core/services/project.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  constructor(private proyectoService: ProyectoService) {
    this.backendUrl = environment.backendUrl; // Initialize in constructor
  }

  ngOnInit(): void {
    this.loadProjectData();
  }

  loadProjectData(): void {
    this.isLoading = true;
    this.errorMessage = undefined;
    this.projectsSubscription = this.proyectoService.getProyectoByPersonaId(this.PUBLIC_PERSONA_ID).subscribe({
      next: (data: Proyecto[]) => {
        this.projects = data;
        this.isLoading = false;
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

  // Method to construct the full image URL
  getFullImageUrl(relativeUrl: string | null | undefined): string {
    if (relativeUrl && relativeUrl.trim() !== '') {
      // Check if the relativeUrl is already an absolute URL or a data URL
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://') || relativeUrl.startsWith('data:')) {
        return relativeUrl;
      }
      return `${this.backendUrl}${relativeUrl}`;
    }
    return 'assets/img/icono-de-proyecto-default.webp'; // Return default image if no valid project image URL
  }
}
