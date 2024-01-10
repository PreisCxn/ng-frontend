import {Component, Input} from '@angular/core';
import {ParallaxBuilder} from "../shared/parallax.directive";

@Component({
  selector: 'hero-image',
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent {

  @Input() src: string | undefined;

  @Input() alt: string | undefined;

  @Input() parallax: ParallaxBuilder = ParallaxBuilder.defaultConfig();

}
