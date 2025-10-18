import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder) {
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
  } 
  }

}
