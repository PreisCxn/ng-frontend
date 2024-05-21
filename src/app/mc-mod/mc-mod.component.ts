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
import {interval, Subscription} from "rxjs";
import {RandomFireworkComponent} from "../section/hero/random-firework/random-firework.component";
import {TranslationService} from "../shared/translation.service";
import {NgIf} from "@angular/common";
import {HomeComponent} from "../home/home.component";
import {CategoryEntry} from "../shared/types/categories.types";

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
    RandomFireworkComponent,
    NgIf
  ],
  templateUrl: './mc-mod.component.html',
  styleUrl: './mc-mod.component.scss'
})
export class McModComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('ahanim') ahanim!: ElementRef;
  @ViewChild('tabanim') tabanim!: ElementRef;
  @ViewChild('onlinePlayers') onlinePlayer!: ElementRef;

  private observer!: IntersectionObserver;
  private onlinePlayerObserver!: IntersectionObserver;

  private activePlayers: number | undefined = undefined;
  private onlinePlayers: number | undefined = undefined;
  private totalUser: number | undefined = undefined;
  private onlinePlayersInterval: Subscription | undefined = undefined;

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
  ];

  public static readonly MOD_CATEGORIES: CategoryEntry[] = [
    {
      pcxnId: -5,
      route: 'citybuild',
      translationData: {
        translatableKey: "pcxn.subsite.citybuild.sectionTitle"
      },
      inNav: false
    },
    {
      pcxnId: -3,
      route: '',
      translationData: {
        translatableKey: "pcxn.subsite.home.title"
      },
      inNav: false
    },
    {
      pcxnId: -4,
      route: 'skyblock',
      translationData: {
        translatableKey: "pcxn.subsite.skyblock.sectionTitle"
      },
      inNav: false
    },
  ];

  constructor(
    private dataService: DataService,
    private headerService: HeaderService,
    protected redirect: RedirectService,
    protected translation: TranslationService
  ) {
    this.headerService.init(
      "pcxn.subsite.mod.sectionTitle",
      true,
      false,
      MenuActives.MOD
    );
  }

  ngOnInit(): void {

    this.dataService.getActivePlayers().then((players) => {
      this.activePlayers = players.activePlayers;
      console.log('Active Players:', this.activePlayers);
    });

    this.dataService.getTotalModUser().then((users) => {
      this.totalUser = users.totalUser;
      console.log('Total User:', this.totalUser);
    });

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    });

    this.onlinePlayerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startOnlinePlayerInterval();
        } else {
          this.stopOnlinePlayerInterval();
        }
      });
    });

    this.headerService.initHeaderCategories(McModComponent.MOD_CATEGORIES, this.onCategoryClick.bind(this), null)

    this.redirect.resetQueryParams();
    this.redirect.scrollToTop(false);
  }

  protected onCategoryClick(category: CategoryEntry) {
    this.redirect.setQueryParams({menu: null}, true);
    setTimeout(() => {
      this.redirect.redirect(category.route);
    });
  }

  private startOnlinePlayerInterval(): void {
    this.updateOnlinePlayers();
    this.onlinePlayersInterval = interval(30 * 1000)
      .subscribe(this.updateOnlinePlayers.bind(this));
  }

  private stopOnlinePlayerInterval(): void {
    if(this.onlinePlayersInterval) {
      this.onlinePlayersInterval.unsubscribe();
      this.onlinePlayersInterval = undefined;
    }
  }

  private updateOnlinePlayers(): void {
    this.dataService.getOnlinePlayers().then((players) => {
      this.onlinePlayers = players.onlinePlayers;
      console.log('Online Players:', this.onlinePlayers);
    });
  }

  protected readonly HeadingComponent = HeadingComponent;
  protected readonly JumpButtonComponent = JumpButtonComponent;

  ngAfterViewInit(): void {
    this.observer.observe(this.ahanim.nativeElement);
    this.observer.observe(this.tabanim.nativeElement);
    this.onlinePlayerObserver.observe(this.onlinePlayer.nativeElement);
  }

  protected readonly ModeService = ModeService;

  ngOnDestroy(): void {
    this.observer.unobserve(this.ahanim.nativeElement);
    this.observer.unobserve(this.tabanim.nativeElement);
    this.observer.disconnect();
    this.onlinePlayerObserver.unobserve(this.onlinePlayer.nativeElement);
    this.onlinePlayerObserver.disconnect();
    this.stopOnlinePlayerInterval();
  }

  protected getActivePlayers(): number | undefined {
    return this.activePlayers;
  }

  protected getOnlinePlayers(): number | undefined {
    return this.onlinePlayers;
  }

  protected getTotalUser(): number | undefined {
    return this.totalUser;
  }

  protected downloadModOnly(): void {
    this.redirect.downloadFile('https://cdn.preiscxn.de/PriceCxnMod.jar');
  }

  protected downloadFabric(): void {
    this.redirect.downloadFile('https://cdn.preiscxn.de/PriceCxnMod.jar');
    setTimeout(() => {
      this.redirect.downloadFile('https://maven.fabricmc.net/net/fabricmc/fabric-installer/1.0.1/fabric-installer-1.0.1.exe');
    }, 500);
    setTimeout(() => {
      this.dataService.getFabricDownload().then((url) => {
        this.redirect.downloadFile(url);
      });
    }, 1000);
  }

  protected downloadModOnly1_20_4(): void {
    this.redirect.downloadFile('https://cdn.preiscxn.de/PriceCxnMod.jar?version=1.0.0.1.20.4-1.20.4');
  }

  protected readonly CategoryNavComponent = CategoryNavComponent;
}
