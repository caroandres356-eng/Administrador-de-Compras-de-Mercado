import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ListService } from '../../services/list.service';
import { Product, GroceryList } from '../../models';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-frequent-purchases',
    standalone: true,
    imports: [CommonModule, ProductCardComponent, FormsModule],
    template: `
    <div class="frecuentes-header">
      <div class="header-text">
        <h1>Compras Frecuentes</h1>
        <p>Añade rápidamente tus productos favoritos a tus listas de mercado.</p>
      </div>
      
      <div class="list-selector">
        <label>Agregar a:</label>
        <select class="select-field" [(ngModel)]="selectedListId">
          <option value="" disabled>Selecciona una lista...</option>
          <option *ngFor="let list of myLists" [value]="list.id">{{ list.title }}</option>
        </select>
      </div>
    </div>

    <!-- Success Message Toast -->
    <div *ngIf="addedMessage" class="toast-message">
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      {{ addedMessage }}
    </div>

    <div class="products-grid">
      <app-product-card 
         *ngFor="let product of frequentProducts" 
         [product]="product"
         [context]="'frecuente'"
         (add)="onAddToSelectedList($event)">
      </app-product-card>
    </div>
  `,
    styles: [`
    .frecuentes-header {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    @media (min-width: 768px) {
      .frecuentes-header {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
      }
    }
    .header-text h1 {
      font-size: 1.875rem;
      font-weight: bold;
      color: var(--text-primary);
    }
    .header-text p {
      color: var(--text-secondary);
      margin-top: 0.5rem;
    }
    .list-selector {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background-color: var(--card-bg);
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .list-selector label {
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
    }
    .select-field {
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      background-color: white;
      min-width: 200px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }
    .toast-message {
      background-color: var(--success-color);
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class FrequentPurchasesComponent implements OnInit {
    frequentProducts: Product[] = [];
    myLists: GroceryList[] = [];
    selectedListId: string = '';
    addedMessage: string | null = null;

    constructor(
        private productService: ProductService,
        private listService: ListService
    ) { }

    ngOnInit(): void {
        this.frequentProducts = this.productService.getFrecuentes();
        // Utilizando el cache del listService para no tener delays visuales
        this.listService.getLists().subscribe(lists => {
            this.myLists = lists;
            if (lists.length > 0) {
                this.selectedListId = lists[0].id;
            }
        });
    }

    onAddToSelectedList(productTemplate: Product) {
        if (!this.selectedListId) {
            alert('Por favor selecciona una lista primero.');
            return;
        }

        this.productService.addProduct(this.selectedListId, {
            nombre: productTemplate.nombre,
            precio: productTemplate.precio,
            categoria: productTemplate.categoria,
            image: productTemplate.image
        }).subscribe(() => {
            this.addedMessage = `¡${productTemplate.nombre} añadido a la lista!`;
            setTimeout(() => this.addedMessage = null, 3000);
        });
    }
}
