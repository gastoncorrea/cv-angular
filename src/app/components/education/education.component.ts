import { Component, OnInit, OnDestroy } from '@angular/core';
import { Educacion } from 'src/app/models/education.model';
import { EducacionService } from 'src/app/core/services/education.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment'; // Import environment

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
  private readonly PUBLIC_PERSONA_ID = 1; // Assuming a fixed ID for the public persona profile
  backendUrl: string; // Declare backendUrl property

  constructor(private educationService: EducacionService) {
    this.backendUrl = environment.backendUrl; // Initialize in constructor
  }

  ngOnInit(): void {
    this.loadEducationData();
  }

  loadEducationData(): void {
    this.isLoading = true;
    this.errorMessage = undefined;
    this.educationSubscription = this.educationService.getEducacionByPersonaId(this.PUBLIC_PERSONA_ID).subscribe({
      next: (data: Educacion[]) => {
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

  // Method to construct the full image URL
  getFullImageUrl(relativeUrl: string | null | undefined): string {
    if (relativeUrl && relativeUrl.trim() !== '') {
      // Check if the relativeUrl is already an absolute URL or a data URL
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://') || relativeUrl.startsWith('data:')) {
        return relativeUrl;
      }
      return `${this.backendUrl}${relativeUrl}`;
    }
    return 'assets/img/logo_default_education.jpg'; // Return default image if no valid logo URL
  }
}
