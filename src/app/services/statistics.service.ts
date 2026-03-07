import { Injectable } from '@angular/core';
import { Observable, delay, from, map, switchMap } from 'rxjs';
import { ChartData } from '../models';
import { ListService } from './list.service';

@Injectable({
    providedIn: 'root'
})
export class StatisticsService {

    constructor(private listService: ListService) { }

    getMonthlyFinancials(): Observable<{ totalSpent: number, chartData: ChartData[] }> {
        return this.listService.getLists().pipe(
            map(lists => {
                let totalSpent = 0;
                const categoryTotals: { [key: string]: number } = {};

                for (const list of lists) {
                    const productsStr = localStorage.getItem(`products_angular_${list.id}`);
                    const products = productsStr ? JSON.parse(productsStr) : [];

                    for (const p of products) {
                        if (p.status === 'comprado') {
                            const price = parseFloat(p.precio) || 0;
                            totalSpent += price;

                            if (!categoryTotals[p.categoria]) {
                                categoryTotals[p.categoria] = 0;
                            }
                            categoryTotals[p.categoria] += price;
                        }
                    }
                }

                const chartData: ChartData[] = Object.keys(categoryTotals).map(key => ({
                    name: key.charAt(0).toUpperCase() + key.slice(1),
                    value: categoryTotals[key]
                })).sort((a, b) => b.value - a.value);

                return { totalSpent, chartData };
            }),
            delay(400)
        );
    }
}
