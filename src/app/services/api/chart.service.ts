import { Injectable } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor() {
    Chart.register(...registerables);
  }

  createPieChart(
    canvasId: string,
    labels: string[],
    data: number[],
    label: string,
    borderColor: string
  ): Chart<'pie'> {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    return new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            borderColor: borderColor,
            borderWidth: 2,
          },
        ],
      },
    });
  }
}
