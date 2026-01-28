import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonaService } from 'src/app/core/services/persona.service';
import { Persona } from 'src/app/models/person.model';
import { Subscription } from 'rxjs'; // For managing subscriptions

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  persona: Persona | undefined;
  isLoading: boolean = false;
  errorMessage: string | undefined;
  private personaSubscription: Subscription | undefined;

  // Assuming a fixed ID for the public persona profile
  private readonly PUBLIC_PERSONA_ID = 1;

  constructor(private personaService: PersonaService) { }

  ngOnInit(): void {
    this.loadPersonaData();
  }

  loadPersonaData(): void {
    this.isLoading = true;
    this.errorMessage = undefined;
    this.personaSubscription = this.personaService.getPersona(this.PUBLIC_PERSONA_ID).subscribe({
      next: (data: Persona) => {
        this.persona = data;
        this.isLoading = false;
        console.log('Datos de Persona recibidos en HomeComponent:', data); // Added console log
        console.log('Datos de Contactos recibidos en HomeComponent:', data.contactos); // Added console log
      },
      error: (error) => {
        this.errorMessage = `Error al cargar los datos personales: ${error.message}`;
        this.isLoading = false;
        console.error('Error en HomeComponent al cargar Persona:', error); // Added console log
      }
    });
  }

  ngOnDestroy(): void {
    if (this.personaSubscription) {
      this.personaSubscription.unsubscribe();
    }
  }
}
