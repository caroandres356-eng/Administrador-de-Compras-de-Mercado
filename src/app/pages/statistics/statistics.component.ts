import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../services/statistics.service';
import Chart from 'chart.js/auto';

@Component({
    selector: 'app-statistics',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="loading" class="loading-state">Cargando estadísticas...</div>

    <div *ngIf="!loading">
      <h1 class="page-title">Resumen Financiero</h1>

      <div class="metrics-grid">
        <div class="metric-card">
          <h2>Gasto Total Acumulado</h2>
          <div class="metric-value">\${{ stats.totalSpent | number }}</div>
          <p class="metric-note">(Basado únicamente en productos marcados como "comprados")</p>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3 class="chart-title">Gastos por Categoría</h3>
          <div class="chart-container" [style.display]="stats.chartData.length ? 'block' : 'none'">
            <canvas #pieChart></canvas>
          </div>
          <div *ngIf="!stats.chartData.length" class="empty-chart">No hay datos para mostrar</div>
        </div>

        <div class="chart-card">
          <h3 class="chart-title">Detalle de Gastos</h3>
          <div class="chart-container" [style.display]="stats.chartData.length ? 'block' : 'none'">
            <canvas #barChart></canvas>
          </div>
          <div *ngIf="!stats.chartData.length" class="empty-chart">No hay datos para mostrar</div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .loading-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
      background-color: var(--card-bg);
      border-radius: 0.5rem;
    }
    .page-title {
      font-size: 1.875rem;
      font-weight: bold;
      margin-bottom: 2rem;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .metric-card {
      background-color: var(--primary-color);
      color: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .metric-card h2 {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }
    .metric-value {
      font-size: 3rem;
      font-weight: bold;
    }
    .metric-note {
      margin-top: 1rem;
      font-size: 0.875rem;
      opacity: 0.8;
    }
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }
    .chart-card {
      background-color: var(--card-bg);
      padding: 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .chart-title {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .chart-container {
      position: relative;
      height: 300px;
      width: 100%;
    }
    .empty-chart {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
    }
  `]
})
export class StatisticsComponent implements OnInit {
    @ViewChild('pieChart') private pieChartRef!: ElementRef;
    @ViewChild('barChart') private barChartRef!: ElementRef;

    pieChartInstance: any;
    barChartInstance: any;

    stats = { totalSpent: 0, chartData: [] as { name: string, value: number }[] };
    loading = true;

    constructor(private statisticsService: StatisticsService) { }

    ngOnInit() {
        this.statisticsService.getMonthlyFinancials().subscribe(data => {
            this.stats = data;
            this.loading = false;

            if (this.stats.chartData.length > 0) {
                setTimeout(() => this.renderCharts(), 0);
            }
        });
    }

    renderCharts() {
        const labels = this.stats.chartData.map(d => d.name);
        const data = this.stats.chartData.map(d => d.value);
        const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

        // Destroy existing charts to avoid overlaps
        if (this.pieChartInstance) this.pieChartInstance.destroy();
        if (this.barChartInstance) this.barChartInstance.destroy();

        this.pieChartInstance = new Chart(this.pieChartRef.nativeElement, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });

        this.barChartInstance = new Chart(this.barChartRef.nativeElement, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Gastos por Categoría',
                    data: data,
                    backgroundColor: '#4f46e5'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y', // Horizontal bar chart
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}
