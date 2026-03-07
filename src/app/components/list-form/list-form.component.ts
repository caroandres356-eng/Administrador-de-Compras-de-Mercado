import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-list-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ initialData ? 'Editar Lista' : 'Nueva Lista' }}</h2>
          <button (click)="onClose()" class="close-btn">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmitForm()" #form="ngForm">
          <div class="form-group">
            <label>Nombre de la lista</label>
            <input
              type="text"
              class="input-field"
              [(ngModel)]="title"
              name="title"
              placeholder="Ej. Compra de la semana"
              required
              autofocus
            />
          </div>
          
          <div class="form-actions">
            <button type="button" (click)="onClose()" class="btn btn-outline">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="!form.valid">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .modal-header h2 {
      font-size: 1.25rem;
      font-weight: bold;
    }
    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-secondary);
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }
  `]
})
export class ListFormComponent {
    @Input() initialData: any = null;
    @Output() save = new EventEmitter<{ title: string }>();
    @Output() close = new EventEmitter<void>();

    title: string = '';

    ngOnInit() {
        if (this.initialData) {
            this.title = this.initialData.title;
        }
    }

    onSubmitForm() {
        if (this.title.trim()) {
            this.save.emit({ title: this.title });
        }
    }

    onClose() {
        this.close.emit();
    }
}
