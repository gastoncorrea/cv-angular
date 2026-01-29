import { Component, OnInit, OnDestroy } from '@angular/core';
import { Herramienta } from 'src/app/models/tools.model'; // Import Herramienta
import { Proyecto } from 'src/app/models/project.model'; // Import Proyecto
import { Educacion } from 'src/app/models/education.model'; // Import Educacion
import { ProyectoService } from 'src/app/core/services/project.service'; // Import ProyectoService
import { EducacionService } from 'src/app/core/services/education.service'; // Import EducacionService
import { Subscription, forkJoin } from 'rxjs'; // Import forkJoin
import { environment } from 'src/environments/environment'; // Import environment

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, OnDestroy {
  allProjects: Proyecto[] = [];
  allEducation: Educacion[] = [];
  skillsWithProgress: { herramienta: Herramienta, usageCount: number, percentage: number }[] = [];

  isLoading: boolean = false;
  errorMessage: string | undefined;
  private dataSubscription: Subscription | undefined;
  private readonly PUBLIC_PERSONA_ID = 1; // Assuming a fixed ID for the public persona profile
  backendUrl: string; // Declare backendUrl property

  constructor(
    private proyectoService: ProyectoService,
    private educacionService: EducacionService
  ) {
    this.backendUrl = environment.backendUrl; // Initialize in constructor
  }

  ngOnInit(): void {
    this.loadAllUsageData();
  }

  loadAllUsageData(): void {
    this.isLoading = true;
    this.errorMessage = undefined;

    this.dataSubscription = forkJoin([
      this.proyectoService.getProyectoByPersonaId(this.PUBLIC_PERSONA_ID),
      this.educacionService.getEducacionByPersonaId(this.PUBLIC_PERSONA_ID)
    ]).subscribe({
      next: ([proyectos, educacion]) => {
        this.allProjects = proyectos;
        this.allEducation = educacion;
        this.processSkillsData(); // Process data after fetching
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Error al cargar datos de habilidades: ${error.message}`;
        this.isLoading = false;
        console.error('Error en SkillsComponent al cargar datos:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
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
    return 'assets/img/icono-de-herramienta-logo.webp'; // Return default image if no valid logo URL
  processSkillsData(): void {
    const toolUsageMap = new Map<number | string, { herramienta: Herramienta, count: number }>();
    let totalToolUsages = 0;

    // Aggregate tools from projects
    this.allProjects.forEach(proyecto => {
      proyecto.herramientas?.forEach(herramienta => {
        if (herramienta.id_herramienta || herramienta.nombre) {
          const key = herramienta.id_herramienta ?? herramienta.nombre; // Use ID if available, otherwise name
          totalToolUsages++;
          if (toolUsageMap.has(key)) {
            toolUsageMap.get(key)!.count++;
          } else {
            toolUsageMap.set(key, { herramienta: herramienta, count: 1 });
          }
        }
      });
    });

    // Aggregate tools from education
    this.allEducation.forEach(educacion => {
      educacion.herramientas?.forEach(herramienta => {
        if (herramienta.id_herramienta || herramienta.nombre) {
          const key = herramienta.id_herramienta ?? herramienta.nombre; // Use ID if available, otherwise name
          totalToolUsages++;
          if (toolUsageMap.has(key)) {
            toolUsageMap.get(key)!.count++;
          } else {
            toolUsageMap.set(key, { herramienta: herramienta, count: 1 });
          }
        }
      });
    });

    this.skillsWithProgress = [];
    if (totalToolUsages > 0) {
      toolUsageMap.forEach(entry => {
        const percentage = (entry.count / totalToolUsages) * 100;
        this.skillsWithProgress.push({
          herramienta: entry.herramienta,
          usageCount: entry.count,
          percentage: parseFloat(percentage.toFixed(2)) // Round to 2 decimal places
        });
      });
    }

    // Sort by percentage (descending) or by name
    this.skillsWithProgress.sort((a, b) => {
      if (a.percentage !== b.percentage) {
        return b.percentage - a.percentage; // Higher percentage first
      }
      return a.herramienta.nombre.localeCompare(b.herramienta.nombre); // Alphabetical by name
    });
  }
}
