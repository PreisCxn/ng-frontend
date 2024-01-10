import {Component, OnInit} from '@angular/core';
import {Direction, ParallaxBuilder, ParallaxDirective} from "../shared/parallax.directive";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Breakpoint} from "../../../shared/breakpoint";

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

  private breakpoints: Breakpoint;

  constructor(private breakpointObserver:  BreakpointObserver) {
    this.breakpoints = new Breakpoint(breakpointObserver).initStandard([1, 2, 3], 1);
  }

  ngOnInit(): void {
    this.breakpoints.subscribe(value => {
      console.log(value);
    })
  }

    protected readonly ParallaxBuilder = ParallaxBuilder;
}
