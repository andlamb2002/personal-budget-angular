import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pb-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent {

  @Input() title = "Title";
  @Input() content = "Content";

  constructor() { }

  ngOnInit(): void {
  }
}
