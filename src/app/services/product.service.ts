import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Product } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor() { }

    private getProductsKey(listId: string): string {
        return `products_angular_${listId}`;
    }

    // Compras frecuentes (Demo con imágenes)
    getFrecuentes(): Product[] {
        return [
            { id: 'f1', nombre: 'Leche', precio: 4500, categoria: 'alimentos', status: 'pendiente', image: 'https://images.unsplash.com/photo-1550583724-b2692bcff1ac?w=300&q=80', purchased: false },
            { id: 'f2', nombre: 'Pan de Molde', precio: 5000, categoria: 'alimentos', status: 'pendiente', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80', purchased: false },
            { id: 'f3', nombre: 'Huevos', precio: 12000, categoria: 'alimentos', status: 'pendiente', image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=300&q=80', purchased: false },
            { id: 'f4', nombre: 'Manzanas', precio: 6000, categoria: 'alimentos', status: 'pendiente', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?w=300&q=80', purchased: false },
            { id: 'f5', nombre: 'Arroz', precio: 3500, categoria: 'alimentos', status: 'pendiente', image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?w=300&q=80', purchased: false },
            { id: 'f6', nombre: 'Jabón', precio: 2500, categoria: 'aseo', status: 'pendiente', image: 'https://images.unsplash.com/photo-1600857062241-9a91eb8f99e4?w=300&q=80', purchased: false },
            { id: 'f7', nombre: 'Shampoo', precio: 18000, categoria: 'aseo', status: 'pendiente', image: 'https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=300&q=80', purchased: false },
            { id: 'f8', nombre: 'Papel higiénico', precio: 15000, categoria: 'aseo', status: 'pendiente', image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=300&q=80', purchased: false }
        ];
    }

    getInitialData(listId: string): Product[] {
        const stored = localStorage.getItem(this.getProductsKey(listId));
        if (stored) {
            const parsed: any[] = JSON.parse(stored);
            const normalized: Product[] = parsed.map((p: any) => ({
                ...p,
                purchased: typeof p.purchased === 'boolean' ? p.purchased : p.status === 'comprado'
            }));
            localStorage.setItem(this.getProductsKey(listId), JSON.stringify(normalized));
            return normalized;
        }

        // Si no existen productos y es una de las listas demo, inyectar algunos iniciales
        let initialProducts: Product[] = [];
        if (listId === 'l1') {
            initialProducts = [
                { id: 'p1', nombre: 'Leche', precio: 4500, categoria: 'alimentos', status: 'pendiente', image: 'https://images.unsplash.com/photo-1550583724-b2692bcff1ac?w=300&q=80', purchased: false },
                { id: 'p2', nombre: 'Pan de Molde', precio: 5000, categoria: 'alimentos', status: 'comprado', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80', purchased: true }
            ];
            localStorage.setItem(this.getProductsKey(listId), JSON.stringify(initialProducts));
        } else if (listId === 'l2') {
            initialProducts = [
                { id: 'p3', nombre: 'Jabón', precio: 2500, categoria: 'aseo', status: 'pendiente', image: 'https://images.unsplash.com/photo-1600857062241-9a91eb8f99e4?w=300&q=80', purchased: false }
            ];
            localStorage.setItem(this.getProductsKey(listId), JSON.stringify(initialProducts));
        }

        return initialProducts;
    }

    getProductsByListId(listId: string): Observable<Product[]> {
        return of(this.getInitialData(listId)).pipe(delay(250));
    }

    addProduct(listId: string, productData: { nombre: string; precio: number; categoria: string; image?: string }): Observable<Product> {
        const products = this.getInitialData(listId);

        const newProduct: Product = {
            ...productData,
            id: 'p_' + Date.now(),
            status: 'pendiente',
            image: productData.image || 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=300&q=80',
            purchased: false
        };

        products.push(newProduct);
        localStorage.setItem(this.getProductsKey(listId), JSON.stringify(products));
        return of(newProduct).pipe(delay(300));
    }

    updateProduct(listId: string, productId: string, updates: Partial<Product>): Observable<Product> {
        const products = this.getInitialData(listId);
        const index = products.findIndex(p => p.id === productId);

        if (index === -1) throw new Error('Product not found');

        products[index] = { ...products[index], ...updates };
        localStorage.setItem(this.getProductsKey(listId), JSON.stringify(products));
        return of(products[index]).pipe(delay(200));
    }

    deleteProduct(listId: string, productId: string): Observable<boolean> {
        let products = this.getInitialData(listId);
        products = products.filter(p => p.id !== productId);
        localStorage.setItem(this.getProductsKey(listId), JSON.stringify(products));
        return of(true).pipe(delay(300));
    }

    toggleProductStatus(listId: string, productId: string): Observable<Product> {
        const products = this.getInitialData(listId);
        const product = products.find(p => p.id === productId);
        if (!product) throw new Error('Product not found');

        const newStatus = product.status === 'pendiente' ? 'comprado' : 'pendiente';
        const purchased = newStatus === 'comprado';
        return this.updateProduct(listId, productId, { status: newStatus, purchased });
    }
}
