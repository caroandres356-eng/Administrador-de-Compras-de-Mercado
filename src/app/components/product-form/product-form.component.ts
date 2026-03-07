import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ initialData ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
          <button (click)="onClose()" class="close-btn">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmitForm()" #form="ngForm">
          <div class="form-group">
            <label>Nombre</label>
            <input
              type="text"
              class="input-field"
              [(ngModel)]="formData.nombre"
              name="nombre"
              placeholder="Ej. Arroz"
              required
              autofocus
            />
          </div>
          
          <div class="form-group">
            <label>Precio (Aproximado)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              class="input-field"
              [(ngModel)]="formData.precio"
              name="precio"
              placeholder="Ej. 3000"
              required
            />
          </div>

          <div class="form-group">
            <label>Categoría</label>
            <select
              class="input-field"
              [(ngModel)]="formData.categoria"
              name="categoria"
              required
            >
              <option *ngFor="let cat of categorias" [value]="cat.id">{{ cat.label }}</option>
            </select>
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
export class ProductFormComponent implements OnInit {
    @Input() initialData: Product | null = null;
    @Output() save = new EventEmitter<{ nombre: string, precio: number, categoria: string }>();
    @Output() close = new EventEmitter<void>();

    formData = {
        nombre: '',
        precio: 0,
        categoria: 'alimentos'
    };

    categorias = [
        { id: 'alimentos', label: 'Alimentos' },
        { id: 'aseo', label: 'Aseo' },
        { id: 'transporte', label: 'Transporte' },
        { id: 'mascotas', label: 'Mascotas' },
        { id: 'otros', label: 'Otros' }
    ];

    ngOnInit() {
        if (this.initialData) {
            this.formData = {
                nombre: this.initialData.nombre,
                precio: this.initialData.precio,
                categoria: this.initialData.categoria
            };
        }
    }

    onSubmitForm() {
        if (this.formData.nombre.trim() && this.formData.precio) {
            this.save.emit(this.formData);
        }
    }

    onClose() {
        this.close.emit();
    }
}
