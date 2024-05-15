import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HeaderService, MenuActives} from "../shared/header.service";
import {HeroModule} from "../section/hero/hero.module";
import {ChartComponent} from "../section/chart/chart.component";
import {NgClass, NgIf} from "@angular/common";
import {TranslationDirective} from "../shared/translation.directive";
import {DefaultBGComponent} from "../section/hero/default-bg/default-bg.component";
import {JumpButtonComponent} from "../section/hero/jump-button/jump-button.component";
import {CategoryNavComponent} from "../section/hero/category-nav/category-nav.component";
import {HeadingComponent} from "../section/hero/heading/heading.component";
import {TableModule} from "../section/table/table.module";
import {RedirectService} from "../shared/redirect.service";
import {ImageComponent} from "../section/hero/image/image.component";
import {ParallaxBuilder} from "../section/hero/shared/parallax.directive";
import {CategoryEntry} from "../shared/types/categories.types";
import {DeviceDetectorService} from "ngx-device-detector";
import {LottieComponent} from "../section/lottie/lottie.component";
import {RandomFireworkComponent} from "../section/hero/random-firework/random-firework.component";

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
    NgClass,
    LottieComponent,
    RandomFireworkComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('windowAnim') windowAnim!: ElementRef;

  private observer!: IntersectionObserver;

  protected skHover: boolean = false;
  protected cbHover: boolean = false;

  protected iconParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.6)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  constructor(private headerService: HeaderService,
              protected redirect: RedirectService, protected device: DeviceDetectorService) {

  }

  protected readonly HOME_CATEGORIES: CategoryEntry[] = [
    {
      pcxnId: -5,
      route: 'citybuild',
      translationData: {
        translatableKey: "pcxn.subsite.citybuild.sectionTitle"
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
      route: 'skyblock',
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

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    });

    this.headerService.initHeaderCategories(this.HOME_CATEGORIES, this.onCategoryClick.bind(this), null)

    this.redirect.scrollToTop(false);
    this.redirect.resetQueryParams();
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.windowAnim.nativeElement);
    this.observer.disconnect();
  }

  protected onCategoryClick(category: CategoryEntry) {
    this.redirect.setQueryParams({menu: null}, true);
    setTimeout(() => {
      this.redirect.redirect(category.route);
    });
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

  ngAfterViewInit(): void {
    this.observer.observe(this.windowAnim.nativeElement);
  }
}
