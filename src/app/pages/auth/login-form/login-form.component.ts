import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from 'src/app/core/services/user-service.service';
import { Usuario } from 'src/app/models/user.model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private userService: UserServiceService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get Email() {
    return this.form.get('email');
  }
  
  get Password() {
    return this.form.get('password');
  }

  sendLogin(){
    if (this.form.valid) {
      console.log(this.form.value);
      const usuario: Usuario = {
        email: this.Email?.value,
        password: this.Password?.value
      };
      this.userService.saveUsuario(usuario).subscribe({
        next: (response) => {
          alert('Usuario guardado con éxito: ' + response);
      },
        error: (error) => {
          alert('Error al guardar el usuario: ' + error.message);
        },
        complete: () => {
          console.log('Operación de guardado completada');
        }
        }); 
  } 
  }

}
