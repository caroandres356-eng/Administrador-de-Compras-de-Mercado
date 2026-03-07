import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListService } from '../../services/list.service';
import { ProductService } from '../../services/product.service';
import { GroceryList, Product } from '../../models';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductFormComponent, ProductCardComponent],
  template: `
    <div *ngIf="loading" class="loading-state">Cargando lista...</div>

    <div *ngIf="!loading && list" class="detail-container">
      <div class="header-action">
        <button class="btn btn-outline icon-btn" (click)="goBack()">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 class="title-flex">{{ list.title }}</h1>
        <button class="btn btn-primary" (click)="showForm = true">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" class="icon-spacing">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Agregar Producto
        </button>
      </div>

      <div class="filters">
        <span class="filter-label">Filtros:</span>
        <button [class]="filter === 'todos' ? 'btn btn-primary' : 'btn btn-outline'" (click)="setFilter('todos')">Todos</button>
        <button [class]="filter === 'pendientes' ? 'btn btn-primary' : 'btn btn-outline'" (click)="setFilter('pendientes')">Pendientes</button>
        <button [class]="filter === 'comprados' ? 'btn btn-primary' : 'btn btn-outline'" (click)="setFilter('comprados')">Comprados</button>
      </div>

      <div class="sections-container">
        <section *ngIf="showPendingSection">
          <h2 class="section-title">Pendientes</h2>
          <div class="products-grid">
            <div *ngIf="pendingProducts.length === 0" class="empty-state" style="grid-column: 1 / -1;">
              No hay productos pendientes.
            </div>

            <app-product-card 
              *ngFor="let product of pendingProducts" 
              [product]="product"
              [context]="'list'"
              (toggleStatus)="onToggleStatus($event)"
              (edit)="editingProduct = $event"
              (delete)="onDeleteProduct($event)">
            </app-product-card>
          </div>
        </section>

        <section *ngIf="showPurchasedSection">
          <h2 class="section-title">Comprados</h2>
          <div class="products-grid">
            <div *ngIf="purchasedProducts.length === 0" class="empty-state" style="grid-column: 1 / -1;">
              No hay productos comprados.
            </div>

            <app-product-card 
              *ngFor="let product of purchasedProducts" 
              [product]="product"
              [context]="'list'"
              (toggleStatus)="onToggleStatus($event)"
              (edit)="editingProduct = $event"
              (delete)="onDeleteProduct($event)">
            </app-product-card>
          </div>
        </section>
      </div>

      <app-product-form
        *ngIf="showForm"
        (save)="onAddProduct($event)"
        (close)="showForm = false"
      ></app-product-form>

      <app-product-form
        *ngIf="editingProduct"
        [initialData]="editingProduct"
        (save)="onUpdateProduct($event)"
        (close)="editingProduct = null"
      ></app-product-form>
    </div>
  `,
  styles: [`
    .loading-state, .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
      background-color: var(--card-bg);
      border-radius: 0.5rem;
    }
    .header-action {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }
    .icon-btn {
      padding: 0.5rem;
    }
    .icon-spacing {
      margin-right: 0.5rem;
    }
    .title-flex {
      font-size: 1.875rem;
      font-weight: bold;
      flex: 1;
    }
    .filters {
      background-color: var(--card-bg);
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      gap: 1rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .filter-label {
      font-weight: 500;
      margin-right: 0.5rem;
      display: flex;
      align-items: center;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }
  `]
})
export class ListDetailComponent implements OnInit {
  listId: string = '';
  list: GroceryList | null = null;
  products: Product[] = [];
  loading = true;
  filter: 'todos' | 'pendientes' | 'comprados' = 'todos';

  showForm = false;
  editingProduct: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listService: ListService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.listId = params.get('id') || '';
      if (this.listId) {
        this.loadData();
      }
    });
  }

  loadData() {
    this.loading = true;
    this.listService.getListById(this.listId).subscribe(data => {
      if (!data) {
        this.router.navigate(['/dashboard']);
        return;
      }
      this.list = data;
      this.productService.getProductsByListId(this.listId).subscribe(prods => {
        this.products = prods.map(p => ({
          ...p,
          purchased: typeof p.purchased === 'boolean' ? p.purchased : p.status === 'comprado'
        }));
        this.loading = false;
      });
    });
  }

  get pendingProducts() {
    return this.products.filter(p => !p.purchased);
  }

  get purchasedProducts() {
    return this.products.filter(p => p.purchased);
  }

  get showPendingSection() {
    return this.filter === 'todos' || this.filter === 'pendientes';
  }

  get showPurchasedSection() {
    return this.filter === 'todos' || this.filter === 'comprados';
  }

  setFilter(f: 'todos' | 'pendientes' | 'comprados') {
    this.filter = f;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  onAddProduct(data: { nombre: string; precio: number; categoria: string }) {
    this.productService.addProduct(this.listId, data).subscribe(() => {
      this.showForm = false;
      this.loadData();
    });
  }

  onUpdateProduct(data: { nombre: string; precio: number; categoria: string }) {
    if (!this.editingProduct) return;
    this.productService.updateProduct(this.listId, this.editingProduct.id, data).subscribe(() => {
      this.editingProduct = null;
      this.loadData();
    });
  }

  onDeleteProduct(productId: string) {
    if (confirm('¿Eliminar este producto?')) {
      this.productService.deleteProduct(this.listId, productId).subscribe(() => {
        this.loadData();
      });
    }
  }

  onToggleStatus(productId: string) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const previousPurchased = product.purchased;
    const previousStatus = product.status;

    // Actualización optimista en UI
    product.purchased = !product.purchased;
    product.status = product.purchased ? 'comprado' : 'pendiente';

    this.productService.updateProduct(this.listId, productId, {
      purchased: product.purchased,
      status: product.status
    }).subscribe({
      error: () => {
        // Revertir en caso de error
        product.purchased = previousPurchased;
        product.status = previousStatus;
      }
    });
  }
}
