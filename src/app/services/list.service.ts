import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { GroceryList } from '../models';

const LISTS_KEY = 'grocery_lists_angular';

@Injectable({
    providedIn: 'root'
})
export class ListService {

    // Almacenamiento rápido en memoria (caché)
    private memoryCache: GroceryList[] | null = null;
    private isLoaded = false;

    constructor() { }

    private getInitialData(): GroceryList[] {
        if (this.isLoaded && this.memoryCache) return [...this.memoryCache];

        const stored = localStorage.getItem(LISTS_KEY);
        if (stored) {
            this.memoryCache = JSON.parse(stored);
            this.isLoaded = true;
            return [...this.memoryCache!];
        }

        const initial: GroceryList[] = [
            { id: 'l1', title: 'Mercado semanal', date: new Date().toISOString() },
            { id: 'l2', title: 'Productos de aseo', date: new Date().toISOString() },
            { id: 'l3', title: 'Supermercado General', date: new Date().toISOString() }
        ];
        localStorage.setItem(LISTS_KEY, JSON.stringify(initial));
        this.memoryCache = initial;
        this.isLoaded = true;
        return [...this.memoryCache];
    }

    private persistCache() {
        if (this.memoryCache) {
            localStorage.setItem(LISTS_KEY, JSON.stringify(this.memoryCache));
        }
    }

    getLists(): Observable<GroceryList[]> {
        // Si ya está en memoria virtualmente responde inmediatamente (10ms)
        // previniendo recargas de loader lentas
        const delayTime = this.isLoaded ? 10 : 300;
        return of(this.getInitialData()).pipe(delay(delayTime));
    }

    getListById(id: string): Observable<GroceryList | undefined> {
        const lists = this.getInitialData();
        const delayTime = this.isLoaded ? 10 : 200;
        return of(lists.find(l => l.id === id)).pipe(delay(delayTime));
    }

    createList(title: string): Observable<GroceryList> {
        const lists = this.getInitialData();
        const newList: GroceryList = {
            id: 'l_' + Date.now(),
            title,
            date: new Date().toISOString()
        };
        lists.push(newList);
        this.memoryCache = lists;
        this.persistCache();
        return of(newList).pipe(delay(300)); // Simulando red
    }

    updateList(id: string, updates: Partial<GroceryList>): Observable<GroceryList> {
        const lists = this.getInitialData();
        const index = lists.findIndex(l => l.id === id);
        if (index === -1) throw new Error('List not found');

        lists[index] = { ...lists[index], ...updates };
        this.memoryCache = lists;
        this.persistCache();
        return of(lists[index]).pipe(delay(200));
    }

    deleteList(id: string): Observable<boolean> {
        let lists = this.getInitialData();
        lists = lists.filter(l => l.id !== id);
        this.memoryCache = lists;
        this.persistCache();
        return of(true).pipe(delay(200));
    }
}
