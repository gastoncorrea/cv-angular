import { Component, OnInit, OnDestroy } from '@angular/core';
import { Educacion } from 'src/app/models/education.model';
import { EducacionService } from 'src/app/core/services/education.service';
import { Subscription } from 'rxjs';

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

  constructor(private educationService: EducacionService) { }

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
}
