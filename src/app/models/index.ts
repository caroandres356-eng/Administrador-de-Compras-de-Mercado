export interface User {
    id: number;
    username: string;
    name: string;
    token: string;
}

export interface GroceryList {
    id: string;
    title: string;
    date: string;
}

export interface Product {
    id: string;
    nombre: string;
    precio: number;
    categoria: string;
    status: 'pendiente' | 'comprado';
    image?: string;
    purchased: boolean;
}

export interface ChartData {
    name: string;
    value: number;
}
