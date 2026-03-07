import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="layout-wrapper">
      <app-navbar (toggleSidebar)="toggleSidebar()"></app-navbar>
      
      <div class="main-container">
        <app-sidebar [isOpen]="isSidebarOpen" (closeSidebar)="closeSidebar()"></app-sidebar>
        
        <main class="content-area" [class.sidebar-open]="isSidebarOpen">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .main-container {
      display: flex;
      flex: 1;
      margin-top: 64px;
    }
    .content-area {
      flex: 1;
      padding: 2rem;
      transition: margin-left 0.3s ease;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      margin-left: 0;
    }
    @media (min-width: 769px) {
      .content-area.sidebar-open {
        margin-left: var(--sidebar-width);
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  isSidebarOpen = true;

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
    }
  }
}
