import {Component, Input} from '@angular/core';
import {Direction, ParallaxBuilder} from "../shared/parallax.directive";

@Component({
  selector: 'hero-parallax-container',
  templateUrl: './parallax-container.component.html',
  styleUrl: './parallax-container.component.scss'
})
export class ParallaxContainerComponent {

  @Input('parallax') parallax: ParallaxBuilder = ParallaxBuilder.defaultConfig();

  protected readonly Direction = Direction;
  protected readonly ParallaxBuilder = ParallaxBuilder;
}
