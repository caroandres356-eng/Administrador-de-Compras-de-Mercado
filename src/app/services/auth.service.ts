import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';
import { User } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser$: Observable<User | null>;

    constructor() {
        const userStr = localStorage.getItem('user');
        this.currentUserSubject = new BehaviorSubject<User | null>(userStr ? JSON.parse(userStr) : null);
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string): Observable<User> {
        // Simular API
        const user: User = {
            id: 1,
            username: username || 'demoUser',
            name: 'Usuario Demo',
            token: 'mock-jwt-token-12345'
        };

        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);

        return of(user).pipe(delay(500));
    }

    register(username: string, password: string, name: string): Observable<User> {
        const user: User = {
            id: Math.floor(Math.random() * 1000) + 1,
            username,
            name,
            token: 'mock-jwt-token-registered'
        };

        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);

        return of(user).pipe(delay(600));
    }

    logout(): void {
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('user');
    }
}
