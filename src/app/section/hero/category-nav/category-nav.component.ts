import {Component, OnInit} from '@angular/core';
import {Direction, ParallaxDirective} from "../shared/parallax.directive";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Breakpoints} from "../../../shared/breakpoints";

@Component({
  selector: 'app-category-nav',
  standalone: true,
  imports: [
    ParallaxDirective
  ],
  templateUrl: './category-nav.component.html',
  styleUrl: './category-nav.component.scss'
})
export class CategoryNavComponent implements OnInit {
  protected readonly Direction = Direction;

  private breakpoints: Breakpoints;

  constructor(private breakpointObserver:  BreakpointObserver) {
    this.breakpoints = new Breakpoints(breakpointObserver).initStandard([1, 2, 3], 1);
  }

  ngOnInit(): void {
    this.breakpoints.subscribe(value => {
      console.log(value);
    })
  }
}
