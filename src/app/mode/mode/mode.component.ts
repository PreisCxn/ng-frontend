import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ModeService} from "../shared/mode.service";
import {ActivatedRoute} from "@angular/router";
import {HeaderService, MenuActives} from "../../shared/header.service";
import {Optional} from "../../shared/optional";
import {Modes} from "../shared/modes";
import {HeroModule} from "../../section/hero/hero.module";
import {ParallaxBuilder} from "../../section/hero/shared/parallax.directive";

@Component({
  selector: 'app-mode',
  standalone: true,
  imports: [
    HeroModule
  ],
  templateUrl: './mode.component.html',
  styleUrl: './mode.component.scss'
})
export class ModeComponent implements OnInit, AfterViewInit{

  private modeKey: Optional<string> = Optional.empty();

  public headingParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.5)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  public pictureParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.3)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  constructor(private modeService: ModeService,private route: ActivatedRoute, private headerService: HeaderService){ }

  private onModeUpdate(mode: Optional<string>, itemId: Optional<string>): void {
    mode.ifPresent(key => {
      this.modeKey = Optional.of(key);

      this.headerService.init(
        `pcxn.subsite.${key}.sectionTitle`,
        true,
        true,
        key as MenuActives);

    });
  }

  ngOnInit(): void {
    this.headerService.showSearch = true;
    this.headerService.setActivatedCategory(true);
  }

  ngAfterViewInit(): void {
    this.modeService.setActivatedRoute(this.route, this.onModeUpdate.bind(this));
    this.modeKey = this.modeService.mode;
  }


}
