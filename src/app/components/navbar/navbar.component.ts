import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterModule, CommonModule],
    template: `
    <nav class="navbar">
      <div class="nav-brand">
        <button class="menu-btn" (click)="onToggleSidebar()">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <a routerLink="/dashboard" class="logo">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span>Mi Mercado</span>
        </a>
      </div>

      <div class="nav-user">
        <span *ngIf="authService.currentUserValue as user">Hola, {{ user.name }}</span>
        <button (click)="logout()" class="btn btn-outline logout-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Salir
        </button>
      </div>
    </nav>
  `,
    styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background-color: var(--card-bg);
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      position: fixed;
      width: 100%;
      top: 0;
      z-index: 50;
      height: 64px;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .menu-btn {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      color: var(--text-primary);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: bold;
      font-size: 1.25rem;
      color: var(--primary-color);
    }
    .nav-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class NavbarComponent {
    @Output() toggleSidebar = new EventEmitter<void>();

    constructor(public authService: AuthService, private router: Router) { }

    onToggleSidebar() {
        this.toggleSidebar.emit();
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
