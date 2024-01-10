import {Component, Input} from '@angular/core';
import {Optional} from "../../../shared/optional";
import {Direction, ParallaxBuilder} from "../shared/parallax.directive";

@Component({
  selector: 'hero-heading',
  standalone: false,
  templateUrl: './heading.component.html',
  styleUrl: './heading.component.scss'
})
export class HeadingComponent {

  @Input() parallax: ParallaxBuilder = ParallaxBuilder.defaultConfig();

  @Input() wobble: boolean = false;

  protected readonly Direction = Direction;
}
