import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonaService } from 'src/app/core/services/persona.service';
import { Persona, PersonaDto } from 'src/app/models/person.model';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-persona-update-form',
  templateUrl: './persona-update-form.component.html',
  styleUrls: ['./persona-update-form.component.css']
})
export class PersonaUpdateFormComponent implements OnInit {
  personaForm: FormGroup;
  personaId: number | null = null;
  isLoading: boolean = false;
  errorMessage: string | undefined;
  successMessage: string | undefined;

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.personaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      profesion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      descripcion_mi: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(700)]],
      fecha_nacimiento: ['', Validators.required],
      num_celular: ['', [Validators.required, Validators.pattern(/^[+]?[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4,6}$/)]],
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      if (!loggedIn) {
        this.router.navigate(['/']);
      }
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.personaId = +idParam;
        this.loadPersonaData(this.personaId);
      } else {
        this.errorMessage = 'No se proporcionó ID de persona para actualizar.';
      }
    });
  }

  loadPersonaData(id: number): void {
    this.isLoading = true;
    this.personaService.getPersona(id).subscribe({
      next: (data: PersonaDto) => { // Changed type to PersonaDto
        this.personaForm.patchValue({
          nombre: data.nombre,
          apellido: data.apellido,
          profesion: data.profesion,
          descripcion_mi: data.descripcion_mi,
          fecha_nacimiento: data.fecha_nacimiento,
          num_celular: data.num_celular
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading persona data:', err);
        this.errorMessage = 'Error al cargar los datos de la persona.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = undefined;
    this.successMessage = undefined;

    if (this.personaForm.invalid) {
      this.personaForm.markAllAsTouched();
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    if (!this.personaId) {
      this.errorMessage = 'ID de persona no disponible para la actualización.';
      return;
    }

    // Objeto solo con los datos de texto
    const updatedPersona: Omit<PersonaDto, 'id_persona' | 'imagenUrl'> = {
      nombre: this.personaForm.get('nombre')?.value,
      apellido: this.personaForm.get('apellido')?.value,
      profesion: this.personaForm.get('profesion')?.value,
      descripcion_mi: this.personaForm.get('descripcion_mi')?.value,
      fecha_nacimiento: this.personaForm.get('fecha_nacimiento')?.value,
      num_celular: this.personaForm.get('num_celular')?.value,
    };

    this.isLoading = true;
    // Actualizar solo los datos de texto
    this.personaService.updatePersona(this.personaId, updatedPersona as PersonaDto).subscribe({ // Cast to PersonaDto
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Información personal actualizada con éxito.';
        setTimeout(() => this.router.navigate(['/home']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error updating persona data:', err);
        this.errorMessage = 'Error al actualizar la información personal.';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/home']);
  }

  // Getters para fácil acceso en la plantilla
  get nombre() { return this.personaForm.get('nombre'); }
  get apellido() { return this.personaForm.get('apellido'); }
  get profesion() { return this.personaForm.get('profesion'); }
  get descripcion_mi() { return this.personaForm.get('descripcion_mi'); }
  get fecha_nacimiento() { return this.personaForm.get('fecha_nacimiento'); }
  get num_celular() { return this.personaForm.get('num_celular'); }
}

