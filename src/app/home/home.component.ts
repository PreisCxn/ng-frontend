import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HeaderService, MenuActives} from "../shared/header.service";
import {HeroModule} from "../section/hero/hero.module";
import {ChartComponent} from "../section/chart/chart.component";
import {NgClass, NgIf} from "@angular/common";
import {TranslationDirective} from "../shared/translation.directive";
import {DefaultBGComponent} from "../section/hero/default-bg/default-bg.component";
import {JumpButtonComponent} from "../section/hero/jump-button/jump-button.component";
import {CategoryNavComponent} from "../section/hero/category-nav/category-nav.component";
import {HeadingComponent} from "../section/hero/heading/heading.component";
import {CategoryEntry, TranslationType} from "../shared/pcxn.types";
import {TableModule} from "../section/table/table.module";
import {RedirectService} from "../shared/redirect.service";
import {ImageComponent} from "../section/hero/image/image.component";
import {ParallaxBuilder} from "../section/hero/shared/parallax.directive";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroModule,
    ChartComponent,
    NgIf,
    TranslationDirective,
    DefaultBGComponent,
    TableModule,
    NgClass
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  protected skHover: boolean = false;
  protected cbHover: boolean = false;

  protected iconParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.6)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  constructor(private headerService: HeaderService, protected redirect: RedirectService) {

  }

  protected readonly HOME_CATEGORIES: CategoryEntry[] = [
    {
      pcxnId: -5,
      route: 'mode/citybuild',
      translationData: {
        translatableKey: "pcxn.subsite.citybuild.sectionTitle"
      },
      inNav: true
    },
    {
      pcxnId: -2,
      route: 'about',
      translationData: {
        translatableKey: "pcxn.menu.heading.about"
      },
      inNav: true
    },
    {
      pcxnId: -3,
      route: 'mod',
      translationData: {
        translatableKey: "pcxn.subsite.mod.title"
      },
      inNav: true
    },
    {
      pcxnId: -4,
      route: 'mode/skyblock',
      translationData: {
        translatableKey: "pcxn.subsite.skyblock.sectionTitle"
      },
      inNav: true
    },
  ];

  ngOnInit() {
    this.headerService.init(
      "pcxn.subsite.home.sectionTitle",
      true,
      false,
      MenuActives.HOME);

    this.headerService.initHeaderCategories(this.HOME_CATEGORIES, this.onCategoryClick.bind(this), null)
  }

  ngOnDestroy(): void {

  }

  protected onCategoryClick(category: CategoryEntry) {
    this.redirect.redirect(category.route);
  }

  protected onMouseEnterSk() {
    this.skHover = true;
  }

  protected onMouseLeaveSk() {
    this.skHover = false;
  }

  protected onMouseEnterCb() {
    this.cbHover = true;
  }

  protected onMouseLeaveCb() {
    this.cbHover = false;
  }

  protected onMouseEnter(category: CategoryEntry) {
    if(category.route.includes('skyblock'))
      this.onMouseEnterSk();
    else if(category.route.includes('citybuild'))
      this.onMouseEnterCb();
  }

  protected onMouseLeave(category: CategoryEntry) {
    if(category.route.includes('skyblock'))
      this.onMouseLeaveSk();
    else if(category.route.includes('citybuild'))
      this.onMouseLeaveCb();
  }

  protected readonly JumpButtonComponent = JumpButtonComponent;
  protected readonly CategoryNavComponent = CategoryNavComponent;
  protected readonly HeadingComponent = HeadingComponent;
}
