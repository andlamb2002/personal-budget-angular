import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';


@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit{

  public dataSource: {
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
    labels: string[];
  } = {
    datasets: [
        {
            data: [],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
            ]
        }
    ],
    labels: []
  };

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get<any>("http://localhost:3000/budget")
    .subscribe((res: any) => {
      for (let i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;

      }
      this.createChart();
    });
  }

  createChart() {
    if (typeof document !== 'undefined') {
        const ctx = document.getElementById('myChart');
        if (ctx instanceof HTMLCanvasElement && ctx !== null) {
            const myPieChart = new Chart(ctx, {
                type: 'pie',
                data: this.dataSource
            });
        } else {
            console.error("Canvas element 'myChart' not found or not an HTMLCanvasElement.");
        }
    }
}

}
