import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HeaderService, MenuActives} from "../shared/header.service";
import {RedirectService} from "../shared/redirect.service";
import {DefaultBGComponent} from "../section/hero/default-bg/default-bg.component";
import {HeroModule} from "../section/hero/hero.module";
import {HeadingComponent} from "../section/hero/heading/heading.component";
import {TranslationDirective} from "../shared/translation.directive";
import {JumpButtonComponent} from "../section/hero/jump-button/jump-button.component";
import {ScrollLottieComponent} from "../section/scroll-lottie/scroll-lottie.component";
import {LottieComponent} from "../section/lottie/lottie.component";
import {DataService} from "../shared/data.service";
import {ModeService} from "../mode/shared/mode.service";
import {CardComponent, CardFeauture} from "../section/card/card.component";
import {CategoryNavComponent} from "../section/hero/category-nav/category-nav.component";
import {interval, Subject} from "rxjs";
import {RandomFireworkComponent} from "../section/hero/random-firework/random-firework.component";

@Component({
  selector: 'app-mc-mod',
  standalone: true,
  imports: [
    DefaultBGComponent,
    HeroModule,
    TranslationDirective,
    ScrollLottieComponent,
    LottieComponent,
    CardComponent,
    RandomFireworkComponent
  ],
  templateUrl: './mc-mod.component.html',
  styleUrl: './mc-mod.component.scss'
})
export class McModComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('ahanim') ahanim!: ElementRef;
  @ViewChild('tabanim') tabanim!: ElementRef;

  private observer!: IntersectionObserver;

  protected fireworkPlay = new Subject<void>();
  protected fireworkPlay2 = new Subject<void>();

  protected fabricFeautures: CardFeauture[] = [
    [true, '1.20.5 / 1.20.6'],
    [true, 'PreisCxn Mod'],
    [true, 'Fabric Installer'],
    [true, 'Fabric API']
  ];

  protected onlyModFeautures: CardFeauture[] = [
    [true, '1.20.5 / 1.20.6'],
    [true, 'PreisCxn Mod'],
    [false, 'Fabric Installer'],
    [false, 'Fabric API']
    ];

  protected lottieImgs: string[] = [
    DataService.getFromCDN('assets/img/items/cxn/general/items/design_templates/cactus_scroll.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/items/tom_block_coupon.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/items/treasure_chests/keys/default_key.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/indoor_furniture/royal/medievalroyal_chandelier.png', 64),
    DataService.getFromCDN('assets/img/items/cxn/general/specialitems/minion_item.png', 64),

  ]

  constructor(private headerService: HeaderService, protected redirect: RedirectService) {
    this.headerService.init(
      "pcxn.subsite.mod.sectionTitle",
      false,
      false,
      MenuActives.MOD
    );
  }

  ngOnInit(): void {

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    });

    this.redirect.resetQueryParams();
    this.redirect.scrollToTop(false);
  }

  protected readonly HeadingComponent = HeadingComponent;
  protected readonly JumpButtonComponent = JumpButtonComponent;

  ngAfterViewInit(): void {
    this.observer.observe(this.ahanim.nativeElement);
    this.observer.observe(this.tabanim.nativeElement);

    interval(5000).subscribe(() => {
      const randomFirework = Math.floor(Math.random() * 2);
      if (randomFirework === 0) {
        this.fireworkPlay.next();
      } else {
        this.fireworkPlay2.next();
      }
    });
  }

  protected readonly ModeService = ModeService;

  ngOnDestroy(): void {
    this.observer.unobserve(this.ahanim.nativeElement);
    this.observer.unobserve(this.tabanim.nativeElement);
  }

  protected readonly CategoryNavComponent = CategoryNavComponent;
}
