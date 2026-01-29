import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Herramienta } from 'src/app/models/tools.model'; // Import Herramienta
import { HerramientaService } from 'src/app/core/services/tool.service'; // Import HerramientaService
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment'; // Import environment

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() skills: Herramienta[] | undefined; // Input for specific skills (from project/education)
  globalSkills: Herramienta[] | undefined; // To store all skills if fetched globally

  isLoading: boolean = false;
  errorMessage: string | undefined;
  private skillsSubscription: Subscription | undefined;
  backendUrl: string; // Declare backendUrl property

  constructor(private herramientaService: HerramientaService) {
    this.backendUrl = environment.backendUrl; // Initialize in constructor
  }

  ngOnInit(): void {
    // If no specific skills are provided as input, fetch all global skills
    if (!this.skills && (!this.globalSkills || this.globalSkills.length === 0)) {
      this.loadGlobalSkills();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // React to changes in the 'skills' input property
    if (changes['skills']) {
      if (changes['skills'].currentValue && changes['skills'].currentValue.length > 0) {
        // If specific skills are provided via input, use them and stop any global loading
        this.globalSkills = undefined; // Clear global skills if specific ones are provided
        if (this.skillsSubscription) {
          this.skillsSubscription.unsubscribe();
          this.skillsSubscription = undefined;
        }
        this.isLoading = false;
      } else if (!changes['skills'].currentValue && (!this.globalSkills || this.globalSkills.length === 0)) {
        // If skills input is cleared (or was empty) and no global skills are loaded, load global skills
        this.loadGlobalSkills();
      }
    }
  }

  loadGlobalSkills(): void {
    this.isLoading = true;
    this.errorMessage = undefined;
    this.skillsSubscription = this.herramientaService.getAllHerramientas().subscribe({
      next: (data: Herramienta[]) => {
        this.globalSkills = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Error al cargar las herramientas: ${error.message}`;
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.skillsSubscription) {
      this.skillsSubscription.unsubscribe();
    }
  }

  // Helper to determine which set of skills to display
  get skillsToDisplay(): Herramienta[] | undefined {
    return this.skills && this.skills.length > 0 ? this.skills : this.globalSkills;
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
  }
}
