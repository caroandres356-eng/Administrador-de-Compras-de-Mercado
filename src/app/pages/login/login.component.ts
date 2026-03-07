import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="icon-circle">
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h1>Bienvenido de nuevo</h1>
          <p>Ingresa a tu lista de mercado</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label>Usuario</label>
            <input
              type="text"
              class="input-field"
              [(ngModel)]="username"
              name="username"
              placeholder="Ingresa cualquier usuario"
              required
            />
          </div>
          
          <div class="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              class="input-field"
              [(ngModel)]="password"
              name="password"
              placeholder="Ingresa cualquier contraseña"
              required
            />
          </div>
          
          <button type="submit" class="btn btn-primary submit-btn" [disabled]="loading || !loginForm.valid">
            {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <p class="auth-footer">
          ¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a>
        </p>
        <p class="auth-note">
          *Nota: Al ser un prototipo, puedes usar cualquier credencial
        </p>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      display: flex;
      height: 100vh;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-color);
    }
    .auth-card {
      background-color: var(--card-bg);
      padding: 2.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .auth-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2rem;
    }
    .icon-circle {
      background: var(--primary-color);
      color: white;
      padding: 1rem;
      border-radius: 50%;
      margin-bottom: 1rem;
      display: flex;
    }
    .auth-header h1 {
      font-size: 1.5rem;
      font-weight: bold;
    }
    .auth-header p {
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    .submit-btn {
      width: 100%;
      padding: 0.75rem;
      margin-top: 0.5rem;
    }
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    .auth-footer a {
      color: var(--primary-color);
      font-weight: 500;
    }
    .auth-note {
      text-align: center;
      margin-top: 1rem;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
  `]
})
export class LoginComponent {
    username = '';
    password = '';
    loading = false;

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        this.loading = true;
        this.authService.login(this.username, this.password).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: () => {
                alert('Error simulado al iniciar sesión');
                this.loading = false;
            }
        });
    }
}
