import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="product-card" [class.comprado]="product.purchased">
      <div class="card-image">
        <img [src]="product.image || 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=300&q=80'" [alt]="product.nombre" />
        <div class="card-category">{{ product.categoria }}</div>
      </div>
      
      <div class="card-content">
        <h3 class="card-title" [class.strike]="product.purchased">{{ product.nombre }}</h3>
        <p class="card-price">\${{ product.precio | number }}</p>
      </div>
      
      <div class="card-actions">
        <!-- Si se usa en List Detail -->
        <ng-container *ngIf="context === 'list'">
          <label class="status-toggle">
            <input
              type="checkbox"
              [checked]="product.purchased"
              (change)="onToggleStatus()"
            />
            <span class="status-label">
              {{ product.purchased ? 'Comprado' : 'Pendiente' }}
            </span>
          </label>
          <div class="crud-actions">
            <button class="icon-btn edit-btn" (click)="onEdit()" title="Editar">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="icon-btn danger-text" (click)="onDelete()" title="Eliminar">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </ng-container>

        <!-- Si se usa en Frecuentes -->
        <ng-container *ngIf="context === 'frecuente'">
          <button class="btn btn-primary btn-full" (click)="onAdd()">
            + Agregar a Lista
          </button>
        </ng-container>
      </div>
    </div>
  `,
    styles: [`
    .product-card {
      background-color: var(--card-bg);
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .product-card.comprado {
      opacity: 0.75;
      border-top: 3px solid var(--success-color);
    }
    .card-image {
      position: relative;
      height: 140px;
      width: 100%;
      background-color: var(--bg-color);
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-category {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 1rem;
      text-transform: capitalize;
    }
    .card-content {
      padding: 1rem;
      flex: 1;
    }
    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card-title.strike {
      text-decoration: line-through;
      color: var(--text-secondary);
    }
    .card-price {
      font-size: 1.125rem;
      font-weight: bold;
      color: var(--primary-color);
    }
    .card-actions {
      padding: 0.75rem 1rem;
      background-color: #f8fafc;
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .status-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .status-toggle input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--success-color);
      cursor: pointer;
    }
    .status-label {
      text-transform: capitalize;
    }
    .crud-actions {
      display: flex;
      gap: 0.5rem;
    }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      color: var(--text-secondary);
      transition: color 0.2s;
    }
    .icon-btn:hover {
      color: var(--primary-color);
    }
    .danger-text {
      color: var(--danger-color);
    }
    .danger-text:hover {
      color: #b91c1c;
    }
    .btn-full {
      width: 100%;
      justify-content: center;
    }
  `]
})
export class ProductCardComponent {
    @Input() product!: Product;
    @Input() context: 'list' | 'frecuente' = 'list';

    @Output() toggleStatus = new EventEmitter<string>();
    @Output() edit = new EventEmitter<Product>();
    @Output() delete = new EventEmitter<string>();
    @Output() add = new EventEmitter<Product>(); // Útil para frecuentes

    onToggleStatus() {
        this.toggleStatus.emit(this.product.id);
    }

    onEdit() {
        this.edit.emit(this.product);
    }

    onDelete() {
        this.delete.emit(this.product.id);
    }

    onAdd() {
        this.add.emit(this.product);
    }
}
