import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListService } from '../../services/list.service';
import { GroceryList } from '../../models';
import { ListFormComponent } from '../../components/list-form/list-form.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, ListFormComponent],
    template: `
    <div>
      <div class="header-action">
        <h1>Mis Listas</h1>
        <button class="btn btn-primary" (click)="showForm = true">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" class="icon-spacing">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nueva Lista
        </button>
      </div>

      <div *ngIf="loading" class="loading-state">Cargando listas...</div>

      <div *ngIf="!loading && lists.length === 0" class="empty-state">
        No tienes listas de mercado. Crea una para comenzar.
      </div>

      <div *ngIf="!loading && lists.length > 0" class="grid-layout">
        <div class="card" *ngFor="let list of lists">
          <div class="card-content">
            <a [routerLink]="['/lists', list.id]" class="card-link">
              <h3>{{ list.title }}</h3>
            </a>
            <div class="card-meta">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" class="icon-spacing">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {{ list.date | date }}
            </div>
          </div>
          <div class="card-actions">
            <button class="btn btn-outline small-btn" (click)="editingList = list" title="Editar">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn btn-outline small-btn danger-text" (click)="onDeleteList(list.id)" title="Eliminar">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <app-list-form
        *ngIf="showForm"
        (save)="onCreateList($event)"
        (close)="showForm = false"
      ></app-list-form>

      <app-list-form
        *ngIf="editingList"
        [initialData]="editingList"
        (save)="onUpdateList($event)"
        (close)="editingList = null"
      ></app-list-form>
    </div>
  `,
    styles: [`
    .header-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .header-action h1 {
      font-size: 1.875rem;
      font-weight: bold;
    }
    .icon-spacing {
      margin-right: 0.5rem;
    }
    .loading-state, .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
      background-color: var(--card-bg);
      border-radius: 0.5rem;
    }
    .grid-layout {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .card {
      background-color: var(--card-bg);
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card-content {
      padding: 1.5rem;
      flex: 1;
    }
    .card-link {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }
    .card-link h3 {
      font-size: 1.25rem;
      font-weight: bold;
    }
    .card-meta {
      display: flex;
      align-items: center;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    .card-actions {
      padding: 0.75rem 1.5rem;
      background-color: var(--bg-color);
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      border-top: 1px solid var(--border-color);
    }
    .small-btn {
      padding: 0.25rem 0.5rem;
    }
    .danger-text {
      color: var(--danger-color);
      border-color: transparent;
    }
  `]
})
export class DashboardComponent implements OnInit {
    lists: GroceryList[] = [];
    loading = true;
    showForm = false;
    editingList: GroceryList | null = null;

    constructor(private listService: ListService) { }

    ngOnInit() {
        this.loadLists();
    }

    loadLists() {
        this.loading = true;
        this.listService.getLists().subscribe((data) => {
            this.lists = data;
            this.loading = false;
        });
    }

    onCreateList(data: { title: string }) {
        this.listService.createList(data.title).subscribe(() => {
            this.showForm = false;
            this.loadLists();
        });
    }

    onUpdateList(data: { title: string }) {
        if (!this.editingList) return;
        this.listService.updateList(this.editingList.id, data).subscribe(() => {
            this.editingList = null;
            this.loadLists();
        });
    }

    onDeleteList(id: string) {
        if (confirm('¿Estás seguro de eliminar esta lista?')) {
            this.listService.deleteList(id).subscribe(() => {
                this.loadLists();
            });
        }
    }
}
