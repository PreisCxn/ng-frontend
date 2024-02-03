import {
  AfterContentChecked,
  AfterContentInit, AfterRenderPhase,
  AfterRenderRef,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ModeService} from "../shared/mode.service";
import {ActivatedRoute} from "@angular/router";
import {HeaderService, MenuActives} from "../../shared/header.service";
import {ChartComponent} from "../../section/chart/chart.component";
import {HeroModule} from "../../section/hero/hero.module";
import {ParallaxBuilder} from "../../section/hero/shared/parallax.directive";
import {RedirectService} from "../../shared/redirect.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    ChartComponent,
    HeroModule,
    NgClass
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit, AfterViewInit{

  @ViewChild('heading') heading: ElementRef | undefined;

  protected diaParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.4)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  protected jumpButtonParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.2)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  protected headingParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.6)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  protected show: boolean = false;

  constructor(
    private modeService: ModeService,
    route: ActivatedRoute,
    private redirectService: RedirectService,
    private headerService: HeaderService,
    private renderer: Renderer2
  ) {
    modeService.setActivatedRoute(route, () => {});
  }
  ngOnInit(): void {

    this.redirectService.scrollToTop(false);

    this.headerService.init(
      ModeService.itemId.orElse(""),
      false,
      false,
      ModeService.mode.orElse("") as MenuActives);

  }

  ngAfterViewInit(): void {
    console.log(this.heading?.nativeElement);
  }

}
