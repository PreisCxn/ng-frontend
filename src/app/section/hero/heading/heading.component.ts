import {Component, Input, OnInit} from '@angular/core';
import {Optional} from "../../../shared/optional";
import {Direction, ParallaxBuilder} from "../shared/parallax.directive";
import {TranslationService} from "../../../shared/translation.service";

@Component({
  selector: 'hero-heading',
  standalone: false,
  templateUrl: './heading.component.html',
  styleUrl: './heading.component.scss'
})
export class HeadingComponent implements OnInit{

  @Input() title: string = "";
  @Input() parallax: ParallaxBuilder = ParallaxBuilder.defaultConfig();
  @Input() wobble: boolean | [boolean, boolean] = false;
  protected wobbleImgOnly: boolean = false;
  @Input() img: string = "";
  @Input() glow: boolean = false;

  public unofficalKey: string = "pcxn.subsite.mode.hero.unofficial";
  public priceListKey: string = "pcxn.subsite.mode.hero.pricelist";

  constructor(public translation: TranslationService) { }

  protected readonly Direction = Direction;
  protected readonly TranslationService = TranslationService;

  ngOnInit(): void {
    if(this.wobble instanceof Array) {
      this.wobbleImgOnly = this.wobble[0];
      this.wobble = this.wobble[1];
    }
  }
}
