import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Herramienta } from 'src/app/models/tools.model'; // Import Herramienta
import { Proyecto } from 'src/app/models/project.model'; // Import Proyecto
import { Educacion } from 'src/app/models/education.model'; // Import Educacion
import { ProyectoService } from 'src/app/core/services/project.service'; // Import ProyectoService
import { EducacionService } from 'src/app/core/services/education.service'; // Import EducacionService
import { AuthService } from 'src/app/auth.service'; // Import AuthService
import { DataRefreshService } from 'src/app/core/services/data-refresh.service'; // Import DataRefreshService
import { Subscription, forkJoin, of, throwError } from 'rxjs'; // Import forkJoin, of, throwError
import { environment } from 'src/environments/environment'; // Import environment
import { catchError } from 'rxjs/operators'; // Import catchError

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() personaId: number | undefined;
  allProjects: Proyecto[] = [];
  allEducation: Educacion[] = [];
  skillsWithProgress: { herramienta: Herramienta, usageCount: number, percentage: number }[] = [];

  isLoading: boolean = false;
  errorMessage: string | undefined;
  private dataSubscription: Subscription | undefined;
  private refreshSubscription: Subscription | undefined;
  backendUrl: string; // Declare backendUrl property

  constructor(
    private proyectoService: ProyectoService,
    private educacionService: EducacionService,
    private authService: AuthService,
    private refreshService: DataRefreshService
  ) {
    this.backendUrl = environment.backendUrl; // Initialize in constructor
  }

  ngOnInit(): void {
    if (this.personaId) {
      this.loadAllUsageData();
    }
    this.subscribeToRefresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personaId'] && this.personaId && !changes['personaId'].firstChange) {
      this.loadAllUsageData();
    }
  }

  private subscribeToRefresh(): void {
    this.refreshSubscription = this.refreshService.refreshSkills$.subscribe(() => {
      this.loadAllUsageData();
    });
  }

  loadAllUsageData(): void {
    if (!this.personaId) return;
    this.isLoading = true;
    this.errorMessage = undefined;

    this.dataSubscription = forkJoin([
      this.proyectoService.getProyectoByPersonaId(this.personaId).pipe(
        catchError(error => {
          if (error.message.includes('404')) return of([]);
          return throwError(() => error);
        })
      ),
      this.educacionService.getEducacionByPersonaId(this.personaId).pipe(
        catchError(error => {
          if (error.message.includes('404')) return of([]);
          return throwError(() => error);
        })
      )
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
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // Method to construct the full image URL
  getFullImageUrl(relativeUrl: string | null | undefined): string {
    if (relativeUrl && relativeUrl.trim() !== '') {
      if (relativeUrl.startsWith('http') || relativeUrl.startsWith('data:')) return relativeUrl;
      
      let path = relativeUrl;
      if (!path.startsWith('/') && !path.startsWith('uploads/')) {
        path = '/uploads/' + path;
      } else if (path.startsWith('uploads/')) {
        path = '/' + path;
      }
      
      return `${this.backendUrl}${path}`;
    }
    return 'assets/img/icono-de-herramienta-logo.webp';
  }

  processSkillsData(): void {
    const toolUsageMap = new Map<number | string, { herramienta: Herramienta, count: number }>();
    const totalExperienceItems = this.allProjects.length + this.allEducation.length;

    // Contar presencia de herramientas en cada proyecto
    this.allProjects.forEach(proyecto => {
      const toolsInThisProject = new Set<number | string>();
      proyecto.herramientas?.forEach(herramienta => {
        if (herramienta.id_herramienta || herramienta.nombre) {
          const key = herramienta.id_herramienta ?? herramienta.nombre;
          if (!toolsInThisProject.has(key)) {
            toolsInThisProject.add(key);
            if (toolUsageMap.has(key)) {
              toolUsageMap.get(key)!.count++;
            } else {
              toolUsageMap.set(key, { herramienta: herramienta, count: 1 });
            }
          }
        }
      });
    });

    // Contar presencia de herramientas en cada educación
    this.allEducation.forEach(educacion => {
      const toolsInThisEducation = new Set<number | string>();
      educacion.herramientas?.forEach(herramienta => {
        if (herramienta.id_herramienta || herramienta.nombre) {
          const key = herramienta.id_herramienta ?? herramienta.nombre;
          if (!toolsInThisEducation.has(key)) {
            toolsInThisEducation.add(key);
            if (toolUsageMap.has(key)) {
              toolUsageMap.get(key)!.count++;
            } else {
              toolUsageMap.set(key, { herramienta: herramienta, count: 1 });
            }
          }
        }
      });
    });

    this.skillsWithProgress = [];
    if (totalExperienceItems > 0) {
      toolUsageMap.forEach(entry => {
        // El porcentaje es (veces que aparece la herramienta / total de proyectos + educaciones) * 100
        const percentage = (entry.count / totalExperienceItems) * 100;
        this.skillsWithProgress.push({
          herramienta: entry.herramienta,
          usageCount: entry.count,
          percentage: parseFloat(percentage.toFixed(2)) // Redondear a 2 decimales
        });
      });
    }

    // Ordenar por porcentaje (descendente)
    this.skillsWithProgress.sort((a, b) => b.percentage - a.percentage || a.herramienta.nombre.localeCompare(b.herramienta.nombre));
  }
}
