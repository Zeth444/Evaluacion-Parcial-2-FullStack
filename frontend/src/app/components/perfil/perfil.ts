import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html', // Usando los nombres cortos
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    // Validaciones estrictas de la rúbrica
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Solo números
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]] // Exactamente 8 dígitos
    });
  }

  ngOnInit() {
    // Si no hay sesión (ID guardado), lo pateamos de vuelta al login
    if (!this.api.obtenerSesion()) {
      this.router.navigate(['/login']);
    }
  }

 onSubmit() {
  if (this.perfilForm.invalid) {
    this.perfilForm.markAllAsTouched();
    return;
  }

  const userId = this.api.obtenerSesion();
  if (userId) {
    this.api.actualizarPerfil(userId, this.perfilForm.value).subscribe({
      next: (res) => {
        this.mensaje = res.mensaje; // Dirá "DATOS_ACTUALIZADOS"
      },
      error: () => {
        this.mensaje = '>> FALLO_EN_LA_TRANSMISIÓN';
      }
    });
  }
}

  cerrarSesion() {
    this.api.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
