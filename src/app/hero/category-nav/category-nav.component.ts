import { Component } from '@angular/core';
import {Direction, ParallaxDirective} from "../shared/parallax.directive";

@Component({
  selector: 'app-category-nav',
  standalone: true,
  imports: [
    ParallaxDirective
  ],
  templateUrl: './category-nav.component.html',
  styleUrl: './category-nav.component.scss'
})
export class CategoryNavComponent {
  protected readonly Direction = Direction;
}
