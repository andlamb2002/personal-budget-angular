import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';

@Component({
  selector: 'pb-testchart',
  templateUrl: './testchart.component.html',
  styleUrls: ['./testchart.component.scss']
})
export class TestchartComponent implements OnInit {

  private _current: any; // Added private property _current

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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>("http://localhost:3000/budget")
    .subscribe((res: any) => {
      for (let i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;

      }
      this.createD3Chart();
    });
  }

  createD3Chart(): void {
    if (typeof document === 'undefined') {
      // Exit function if running in a non-browser environment
      return;
    }

    const data = this.dataSource.datasets[0].data;

    const svg = d3.select("#d3Chart")
      .append("svg")
      .append("g");

    svg.append("g")
      .attr("class", "slices");
    svg.append("g")
      .attr("class", "labels");
    svg.append("g")
      .attr("class", "lines");

    const width = 960,
      height = 450,
      radius = Math.min(width, height) / 2;

    const pieGenerator = d3.pie()
      .sort(null)
      .value((d: any) => d);

    const arcGenerator = d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    svg.attr("transform", `translate(${width / 2},${height / 2})`);

    const key = (d: any) => d.data.label;

    const midAngle = (d: any) => d.startAngle + (d.endAngle - d.startAngle) / 2;

    const change = (data: any): void => {
      const slice = svg.select(".slices").selectAll("path.slice")
        .data(pieGenerator(data), key);

      slice.enter()
        .insert("path")
        .style("fill", (d: any) => d3.schemeCategory10[key(d)])
        .attr("class", "slice")
        .merge(slice as any)
        .transition().duration(1000)
        .attrTween("d", (d: any) => {
          const interpolate = d3.interpolate(this._current || { startAngle: 0, endAngle: 0 }, d);
          this._current = interpolate(0);
          return function(t: any) {
            return arcGenerator(interpolate(t)) || '';
          };
        });

      slice.exit()
        .remove();

      const text = svg.select(".labels").selectAll("text")
        .data(pieGenerator(data), key);

      text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text((d: any) => d.data.label)
        .merge(text as any)
        .transition().duration(1000)
        .attr("transform", (d: any) => {
          const pos = outerArc.centroid(d);
          pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        })
        .style("text-anchor", (d: any) => midAngle(d) < Math.PI ? "start" : "end");

      text.exit()
        .remove();

      const polyline = svg.select(".lines").selectAll("polyline")
        .data(pieGenerator(data), key);

      polyline.enter()
        .append("polyline")
        .merge(polyline as any)
        .transition().duration(1000)
        .attr("points", (d: any): string => {
          const pos = outerArc.centroid(d);
          pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
          return [arcGenerator.centroid(d), outerArc.centroid(d), pos].join(" ");
        });

      polyline.exit()
        .remove();
    };

    change(data);
  }
}
