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
  private readonly PUBLIC_PERSONA_ID = 1; // Assuming a fixed ID for the public persona profile

  constructor(
    private personaService: PersonaService,
  ) { }

  ngOnInit(): void {
    this.loadPersonaData();
  }

  loadPersonaData(): void {
    this.isLoading = true;
    this.errorMessage = undefined;
    this.personaSubscription = this.personaService.getPersona(this.PUBLIC_PERSONA_ID).subscribe({
      next: (data: Persona) => {
        // Si data es null o no tiene campos esenciales, lo tratamos como sin datos
        if (!data || (!data.nombre && !data.apellido)) {
          this.persona = undefined;
        } else {
          this.persona = data;
        }
        this.isLoading = false;
        console.log('Datos de Persona recibidos en HomeComponent:', data);
      },
      error: (error: Error) => {
        // Si el error es un 404, no mostramos error sino que dejamos persona como undefined (mantenimiento)
        if (error.message.includes('404')) {
          this.persona = undefined;
          this.errorMessage = undefined;
        } else {
          this.errorMessage = `Error al cargar los datos personales: ${error.message}`;
        }
        this.isLoading = false;
        console.error('Error en HomeComponent al cargar Persona:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.personaSubscription) {
      this.personaSubscription.unsubscribe();
    }
  }
}
