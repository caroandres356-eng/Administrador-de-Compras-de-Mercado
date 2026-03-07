import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ListDetailComponent } from './pages/list-detail/list-detail.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { FrequentPurchasesComponent } from './pages/frequent-purchases/frequent-purchases.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'frecuentes', component: FrequentPurchasesComponent },
            { path: 'lists/:id', component: ListDetailComponent },
            { path: 'statistics', component: StatisticsComponent }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
