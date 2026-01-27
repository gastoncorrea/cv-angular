import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from 'src/app/auth.service'; // Import AuthService

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit { // Implement OnInit

  form: FormGroup;
  isRegisterMode = false; // To toggle between login and register forms

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Inject AuthService
    private router: Router // Inject Router
  ) {
    this.form = this.fb.group({
      nombre: [''], // Add nombre field, initially not required
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Set initial validators for register mode if needed, or update when toggling
    this.setValidatorsForMode();
  }

  get Nombre() {
    return this.form.get('nombre');
  }

  get Email() {
    return this.form.get('email');
  }
  
  get Password() {
    return this.form.get('password');
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.setValidatorsForMode();
    this.form.reset(); // Reset form when toggling mode
  }

  private setValidatorsForMode(): void {
    if (this.isRegisterMode) {
      this.Nombre?.setValidators([Validators.required]);
    } else {
      this.Nombre?.clearValidators();
    }
    this.Nombre?.updateValueAndValidity(); // Update validators for 'nombre'
  }

  sendLogin(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Mark all fields as touched to show validation errors
      return;
    }

    const { email, password, nombre } = this.form.value;

    if (this.isRegisterMode) {
      // Registration logic
      this.authService.register({ email, nombre, password }).subscribe({
        next: (res) => {
          console.log('Registro exitoso', res);
          // Optionally, auto-login after registration or navigate to login
          this.isRegisterMode = false; // Switch to login mode
          this.setValidatorsForMode();
          this.form.reset();
          alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
        },
        error: (err) => {
          console.error('Error en el registro', err);
          alert('Error en el registro: ' + (err.error?.message || err.message));
        }
      });
    } else {
      // Login logic
      this.authService.login({ email, password }).subscribe({
        next: (res) => {
          console.log('Login exitoso', res);
          this.router.navigate(['/home']); // Navigate to home or a protected route
        },
        error: (err) => {
          console.error('Error en el login', err);
          alert('Error en el inicio de sesión: Credenciales inválidas');
        }
      });
    }
  }
}
