import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from 'src/app/core/services/user-service.service';
import { UsuarioApi, UsuarioDto, Rol } from 'src/app/models/usuario-api.model';
import { ActivatedRoute } from '@angular/router'; // To get ID from route

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  currentUser: UsuarioApi | undefined;
  isLoading: boolean = false;
  errorMessage: string | undefined;
  isEditMode: boolean = false; // To differentiate between create and edit

  // For demonstration, you might get this from a route parameter
  userId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    // Check for a user ID in the route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id; // Convert string to number
        this.isEditMode = true;
        this.loadUser(this.userId);
      } else {
        // If no ID, it's a create user scenario
        this.isEditMode = false;
        this.userForm.reset();
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id_usuario: [null],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      password: ['', [Validators.minLength(8), Validators.maxLength(200), Validators.required]], // Password might be optional for updates
      // Roles will be handled separately or displayed, not directly in this form
    });

    // If in edit mode, password is not required unless changed
    if (this.isEditMode) {
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  loadUser(id: number): void {
    this.isLoading = true;
    this.errorMessage = undefined;
    this.userService.getUserById(id).subscribe({
      next: (user: UsuarioApi) => {
        this.currentUser = user;
        this.userForm.patchValue({
          id_usuario: user.id_usuario,
          email: user.email,
          nombre: user.nombre,
          // Password is not loaded for security reasons
        });
        // If in edit mode, password field should not be required initially
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el usuario: ' + error.message;
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = undefined;

    const userData: UsuarioApi = this.userForm.value;

    if (this.isEditMode && this.userId) {
      // Update existing user
      const userDto: UsuarioDto = {
        id_usuario: this.userId,
        email: userData.email,
        nombre: userData.nombre,
        password: this.userForm.get('password')?.value || undefined, // Only send password if it was entered
      };
      this.userService.updateUser(this.userId, userDto).subscribe({
        next: (response) => {
          console.log('Usuario actualizado con éxito:', response);
          this.isLoading = false;
          // Optionally, navigate away or show a success message
        },
        error: (error) => {
          this.errorMessage = 'Error al actualizar el usuario: ' + error.message;
          this.isLoading = false;
          console.error(error);
        }
      });
    } else {
      // Create new user
      this.userService.saveUsuario(userData).subscribe({
        next: (response) => {
          console.log('Usuario creado con éxito:', response);
          this.isLoading = false;
          this.userForm.reset(); // Clear form after successful creation
          // Optionally, navigate to the new user's detail page or show a success message
        },
        error: (error) => {
          this.errorMessage = 'Error al crear el usuario: ' + error.message;
          this.isLoading = false;
          console.error(error);
        }
      });
    }
  }

  // Helper for form validation messages
  get email() { return this.userForm.get('email'); }
  get nombre() { return this.userForm.get('nombre'); }
  get password() { return this.userForm.get('password'); }
}
