import {AfterViewInit, Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild} from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ChartConfiguration,
  ChartOptions,
  Tooltip, TooltipModel, TooltipItem
} from 'chart.js';
import {AnimationOptions} from "@angular/animations";
import {isPlatformBrowser} from "@angular/common";
import {DiagramData} from "../../shared/types/item.types";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements AfterViewInit {

  exampleLabels = (size: number) => {
    const labels = [];
    for(let i = size; i > 0; i--) {
      const date = new Date(Date.now());
      date.setDate(date.getDate() - i);
      labels.push(date.getTime().toString());
    }
    return labels;
  }

  exampleData = (size: number, smoothness: number = 5) => {
    const data = [];
    let previousValue = Math.floor(Math.random() * 100);

    for(let i = 0; i < size; i++) {
      let newValue = Math.floor(Math.random() * 100);
      let smoothedValue = (previousValue * (smoothness - 1) + newValue) / smoothness;

      data.push(smoothedValue);
      previousValue = smoothedValue;
    }

    return data;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  private exampleAmount = 15;

  @ViewChild('chart') chartRef: ElementRef | undefined;
  @Input('data') data: DiagramData = {
    labels: this.exampleLabels(this.exampleAmount),
    data: this.exampleData(this.exampleAmount)
  };
  @Input('convertLabelToDay') convertLabelToDay: boolean = true;

  private animationDelay = 1000 / this.data.data.length;

  private formatDateLabel(label: string): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);

    const date = new Date(Number(label));

    if(date.toDateString() === today.toDateString()) {
      return 'Heute';
    } else if(date.toDateString() === yesterday.toDateString()) {
      return 'Gestern';
    } else if(date.toDateString() === dayBeforeYesterday.toDateString()) {
      return 'Vorgestern';
    } else {
      return date.toLocaleDateString();
    }
  }

  ngAfterViewInit(): void {
    if(!isPlatformBrowser(this.platformId)) return;
    if (!this.chartRef) return;

    console.log(this.data)

    const ctx = this.chartRef.nativeElement.getContext('2d');

    if(this.convertLabelToDay) {
      this.data.labels = this.data.labels.map((label, index) => {
        if(isNaN(Number(label))) return label;
        return this.formatDateLabel(label);
      });
    }

    const data = {
      labels: this.data.labels,
      datasets: [{
        label: '',
        data: this.data.data,
        borderColor: 'rgba(255, 255, 255, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 7,
        pointRadius: 5,
        pointHoverRadius: 10
      }]
    };

    const animation: any = {
      x: {
        type: 'number',
        easing: 'linear',
        from: (ctx: any): any => {
          if (ctx.type === 'data') {
            if (ctx.mode === 'default' && !ctx.dropped) {
              ctx.dropped = true;
              return ctx.chart.scales.x.getPixelForValue(0); // Startpunkt der Animation
            }
          }
        },
        delay: (ctx: any): any => {
          if (ctx.type === 'data') {
            return (ctx.index * this.animationDelay) / 2.5; // Verzögerung zwischen den Punkten
          }
        }
      },
      y: {
        type: 'number',
        easing: 'easeInOutElastic',
        from: (ctx: any): any => {
          if (ctx.type === 'data') {
            if (ctx.mode === 'default' && !ctx.dropped) {
              ctx.dropped = true;
              return ctx.chart.scales.y.getPixelForValue(0); // Startpunkt der Animation
            }
          }
        },
        delay: (ctx: any): any => {
          if (ctx.type === 'data') {
            return ctx.index * this.animationDelay; // Verzögerung zwischen den Punkten
          }
        }
      }
    };

    new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        animation,
        responsive: true,
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            bodySpacing: 0,
            callbacks: {
              beforeLabel: function (context) {
                return "";
              },
              afterBody(context: any){
                return context[0].formattedValue;
              },
              label: function (context) {
                return ''; // Leerer String, um den Text im Tooltip zu entfernen
              },
              title: function (context: any) {
                return context.formattedValue; // Leerer String, um den Titel im Tooltip zu entfernen
              }
            },
          }
        }
      }
    });

  }

}
