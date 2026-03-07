import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <aside class="sidebar" [class.open]="isOpen">
      <nav class="sidebar-nav">
        
        <!-- Dropdown Menu Item para Inicio -->
        <div class="nav-dropdown">
          <button class="nav-link dropdown-toggle" (click)="toggleDropdown()">
            <div class="link-content">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Inicio</span>
            </div>
            <svg class="chevron" [class.rotated]="isDropdownOpen" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          <div class="dropdown-menu" [class.show]="isDropdownOpen">
            <a routerLink="/dashboard" routerLinkActive="active" class="sub-nav-link" (click)="onClose()">
              Dashboard
            </a>
            <a routerLink="/frecuentes" routerLinkActive="active" class="sub-nav-link" (click)="onClose()">
              Compras frecuentes
            </a>
            <a routerLink="/dashboard" class="sub-nav-link" (click)="onClose()">
              Listas
            </a>
            <a routerLink="/statistics" routerLinkActive="active" class="sub-nav-link" (click)="onClose()">
              Estadísticas
            </a>
          </div>
        </div>
        
      </nav>
    </aside>

    <!-- Overlay for mobile -->
    <div *ngIf="isOpen" class="sidebar-overlay" (click)="onClose()"></div>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 64px;
      left: -250px;
      width: var(--sidebar-width);
      height: calc(100vh - 64px);
      background-color: var(--card-bg);
      box-shadow: 2px 0 5px rgba(0,0,0,0.05);
      transition: left 0.3s ease;
      z-index: 40;
      padding: 1.5rem 0;
    }
    .sidebar.open {
      left: 0;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .nav-dropdown {
      display: flex;
      flex-direction: column;
    }
    .nav-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      background: none;
      border: none;
      padding: 0.75rem 1.5rem;
      color: var(--text-primary);
      font-size: 1rem;
      cursor: pointer;
      border-left: 4px solid transparent;
      transition: background-color 0.2s, color 0.2s;
    }
    .nav-link:hover {
      background-color: var(--bg-color);
    }
    .link-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 500;
    }
    .chevron {
      transition: transform 0.2s ease;
    }
    .chevron.rotated {
      transform: rotate(180deg);
    }
    .dropdown-menu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-in-out;
      background-color: #f8fafc; /* Lighter background for submenu */
      display: flex;
      flex-direction: column;
    }
    .dropdown-menu.show {
      max-height: 250px;
    }
    .sub-nav-link {
      padding: 0.75rem 1.5rem 0.75rem 3.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
      transition: all 0.2s;
      border-left: 4px solid transparent;
    }
    .sub-nav-link:hover {
      color: var(--primary-color);
      background-color: #edf2f8;
    }
    .sub-nav-link.active {
      color: var(--primary-color);
      font-weight: 500;
      border-left-color: var(--primary-color);
      background-color: #edf2f8;
    }
    .sidebar-overlay {
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.5);
      z-index: 30;
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;
  @Output() closeSidebar = new EventEmitter<void>();

  isDropdownOpen = true; // Abierto por defecto

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onClose() {
    if (window.innerWidth <= 768) {
      this.closeSidebar.emit();
    }
  }
}
