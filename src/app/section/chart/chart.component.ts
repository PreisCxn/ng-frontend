import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ChartConfiguration, ChartOptions
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements AfterViewInit {

  @ViewChild('chart') chartRef: ElementRef | undefined;

  ngAfterViewInit(): void {
    if (!this.chartRef) return;

    const ctx = this.chartRef.nativeElement.getContext('2d');

    const options: ChartOptions = {
      scales: {
        x: {display: false},
        y: {
          beginAtZero: true,
          display: false
        }
      },
      plugins: {
        legend: {
          display: false // Setzen Sie den Wert auf false, um die Legende zu deaktivieren
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            beforeLabel: function (context: any) {
              return context.formattedValue;
            },
            label: function (context: any) {
              return ''; // Leerer String, um den Text im Tooltip zu entfernen
            },
            title: function (context: any) {
              return context.formattedValue; // Leerer String, um den Titel im Tooltip zu entfernen
            }
          }
        }
      },
      transitions: {
        show: {
          animations: {
            x: {
              from: -10000 + 'px'
            },
            y: {
              from: -10000 + 'px'
            }
          }
        }
      }
    };

    // @ts-ignore
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: Array.from({length: 10}, (_, i) => (i + 100).toString()), // Zahlen von 1 bis 10 als Labels
        datasets: [{
          label: "Dataset 1",
          data: Array.from({length: 10}, (_, i) => i + 100), // Zahlen von 1 bis 10 als Daten
          borderColor: 'rgba(255, 255, 255, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 7,
          pointRadius: 5,
          pointHoverRadius: 10
        }]
      },
      options: options
    };

    new Chart(ctx, config);
  }

}
