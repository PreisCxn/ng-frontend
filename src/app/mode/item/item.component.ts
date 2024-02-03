import {Component, OnInit} from '@angular/core';
import {ModeService} from "../shared/mode.service";
import {ActivatedRoute} from "@angular/router";
import {HeaderService, MenuActives} from "../../shared/header.service";
import {ChartComponent} from "../../section/chart/chart.component";
import {HeroModule} from "../../section/hero/hero.module";
import {ParallaxBuilder} from "../../section/hero/shared/parallax.directive";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    ChartComponent,
    HeroModule
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit{

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

  constructor(
    private modeService: ModeService,
    route: ActivatedRoute,
    private headerService: HeaderService,
  ) {
    modeService.setActivatedRoute(route, () => {});
  }
  ngOnInit(): void {

    this.headerService.init(
      ModeService.itemId.orElse(""),
      false,
      false,
      ModeService.mode.orElse("") as MenuActives);

  }

}
