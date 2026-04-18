import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credenciales);
  }

  guardarSesion(usuarioId: number) {
    localStorage.setItem('usuarioId', usuarioId.toString());
  }

  obtenerSesion() {
    return localStorage.getItem('usuarioId');
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioId');
  }

  actualizarPerfil(id: string, datos: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/auth/update-perfil/${id}`, datos);
}
}

