import { Component, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService} from '../../service/auth.service';
import {RegisterRequest } from '../../models/auth'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = false;

  constructor() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: [''],
      last_name: ['']
    }, {
      validator: this.passwordMatchValidator
    });

    // Effect para verificar se está autenticado
    effect(() => {
      if (this.authService.currentUserValue) {
        this.router.navigate(['/clientes']);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const registerRequest: RegisterRequest = {
      username: this.f['username'].value,
      password: this.f['password'].value,
      email: this.f['email'].value,
      first_name: this.f['first_name'].value,
      last_name: this.f['last_name'].value
    };

    this.authService.register(registerRequest)
    .pipe(first())
    .subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        
        setTimeout(() => {
          this.router.navigate(['/clientes']);
        }, 2000);
      },
      error: (error: any) => {
        this.error = error.error?.detail || 'Erro ao criar conta';
        this.loading = false;
      }
    });
  }
}