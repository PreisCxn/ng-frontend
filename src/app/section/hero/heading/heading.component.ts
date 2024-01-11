import {Component, Input} from '@angular/core';
import {Optional} from "../../../shared/optional";
import {Direction, ParallaxBuilder} from "../shared/parallax.directive";
import {TranslationService} from "../../../shared/translation.service";

@Component({
  selector: 'hero-heading',
  standalone: false,
  templateUrl: './heading.component.html',
  styleUrl: './heading.component.scss'
})
export class HeadingComponent {

  @Input() title: string = "";

  @Input() parallax: ParallaxBuilder = ParallaxBuilder.defaultConfig();

  @Input() wobble: boolean = false;

  public readonly inofficalKey: string = "pcxn.inoffical";
  public readonly priceListKey: string = "pcxn.priceList";

  constructor(public translation: TranslationService) {
  }

  protected readonly Direction = Direction;
  protected readonly TranslationService = TranslationService;
}
