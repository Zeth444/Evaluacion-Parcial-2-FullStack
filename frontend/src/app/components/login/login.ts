import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  mensajeError: string = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    // Validaciones
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    // 1. Chismosos para la consola (F12)
    console.log(">> CLICK DETECTADO EN EL BOTÓN");
    console.log(">> DATOS DEL FORMULARIO:", this.loginForm.value);
    console.log(">> ¿ES VÁLIDO?:", this.loginForm.valid ? 'SÍ' : 'NO');

    // 2. Barrera de seguridad
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.log(">> ACCESO DENEGADO: Angular bloqueó el envío por validaciones.");
      return;
    }

    // 3. Conexión al backend
    console.log(">> ENVIANDO PETICIÓN AL BACKEND...");
    this.api.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        console.log(">> RESPUESTA DEL BACKEND:", res);
        this.api.guardarSesion(res.id); // Bug corregido
        this.router.navigate(['/perfil']);
      },
      error: (err: any) => {
        console.error(">> ERROR DEL BACKEND:", err);
        this.mensajeError = err.error?.mensaje || 'Credenciales incorrectas';
      }
    });
  }
}
