import {Component, Input, OnInit} from '@angular/core';
import {Direction, ParallaxBuilder, ParallaxDirective} from "../shared/parallax.directive";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Breakpoint} from "../../../shared/breakpoint";

@Component({
  selector: 'hero-category-nav',
  templateUrl: './category-nav.component.html',
  styleUrl: './category-nav.component.scss'
})
export class CategoryNavComponent implements OnInit {

  @Input('parallax') parallax: ParallaxBuilder = ParallaxBuilder.defaultConfig();

  categories = ['Alles', 'Blöcke', 'Natur', 'Blabla', 'Test123', 'keineAhn', 'JOAA'];
  activeCategory = this.categories[0]; // Set the first category as the active one by default

  setActiveCategory(category: string) {
    this.activeCategory = category;
  }

  constructor() { }

  ngOnInit(): void {

  }

    protected readonly ParallaxBuilder = ParallaxBuilder;
}
