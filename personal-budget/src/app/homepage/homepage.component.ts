import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {

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

  private svg: any;
  private margin = 50;
  private width = 750;
  private height = 600;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: d3.ScaleOrdinal<string, string>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    this.colors = d3.scaleOrdinal<string, string>();
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

  ngOnInit(): void {
    this.http.get<any>("http://localhost:3000/budget")
      .subscribe((res: any) => {
        this.dataSource.datasets[0].data = res.myBudget.map((item: any) => item.budget);
        this.dataSource.labels = res.myBudget.map((item: any) => item.title);
        this.createChart();
      });

    if (isPlatformBrowser(this.platformId)) {
      this.createSvg();
      this.createColors();
      this.drawChart();
    }
  }

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
  }

  private createColors(): void {
    this.colors = d3.scaleOrdinal<string, string>()
      .domain(this.dataSource.labels)
      .range(this.dataSource.datasets[0].backgroundColor);
  }

  private drawChart(): void {
    const pie = d3.pie<any>().value((d: any) => d);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius);

    const labelArc = d3.arc()
      .outerRadius(this.radius - 40)
      .innerRadius(this.radius - 40);

    const arcs = this.svg.selectAll("arc")
      .data(pie(this.dataSource.datasets[0].data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", (d: any, i: any) => this.colors(i))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px");

    arcs.append("text")
      .attr("transform", (d: any) => "translate(" + labelArc.centroid(d) + ")")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text((d: any, i: any) => this.dataSource.labels[i] + ": $" + d.data);
  }
}
