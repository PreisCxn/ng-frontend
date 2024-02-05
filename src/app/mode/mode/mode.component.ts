import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModeService} from "../shared/mode.service";
import {ActivatedRoute} from "@angular/router";
import {HeaderService, MenuActives} from "../../shared/header.service";
import {Optional} from "../../shared/optional";
import {Modes} from "../shared/modes";
import {HeroModule} from "../../section/hero/hero.module";
import {ParallaxBuilder} from "../../section/hero/shared/parallax.directive";
import {TableModule} from "../../section/table/table.module";
import {Themes, ThemeService} from "../../shared/theme.service";
import {NgClass, NgIf, UpperCasePipe} from "@angular/common";
import {ImageComponent} from "../../section/hero/image/image.component";
import {CategoryEntry, ItemShortInfo} from "../../shared/pcxn.types";
import {TranslationService} from "../../shared/translation.service";
import {ItemTableComponent} from "../../section/table/item-table/item-table.component";
import {RedirectService} from "../../shared/redirect.service";
import {TranslationDirective} from "../../shared/translation.directive";
import {LoadingService} from "../../shared/loading.service";

@Component({
  selector: 'app-mode',
  standalone: true,
  imports: [
    HeroModule,
    TableModule,
    NgIf,
    NgClass,
    UpperCasePipe,
    TranslationDirective
  ],
  templateUrl: './mode.component.html',
  styleUrl: './mode.component.scss'
})
export class ModeComponent implements OnInit, AfterViewInit {

  public modeKey: Optional<string> = Optional.empty();
  protected darkMode: boolean = false;

  @ViewChild('moon') moon: ElementRef | undefined;
  @ViewChild('table') itemTable: ItemTableComponent | null = null;

  protected items: ItemShortInfo[] | null = null;

  protected titleKey: string = "";

  protected categories: Optional<CategoryEntry[]> = Optional.empty();

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
    .setValueName("left")
    .setScrollStart(0)
    .setPosition(0);

  public navParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.25)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  public jumpButtonParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.27)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);


  public moonParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.8)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  public cloudParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.9)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  public cloudParallaxFront: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.4)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  constructor(private modeService: ModeService,
              private route: ActivatedRoute,
              private headerService: HeaderService,
              public themeService: ThemeService,
              private redirect: RedirectService,
              private renderer: Renderer2,
              private translation: TranslationService,
              private loading: LoadingService) {
    this.themeService.subscribe(theme => {
      this.darkMode = theme;
      this.calcMoonPosition(theme);
    });
    this.themeService.setMode(this.themeService.getMode());
  }

  private onModeUpdate(mode: Optional<string>, itemId: Optional<string>): void {
    mode.ifPresent(key => {
      this.modeKey = Optional.of(key);

      this.titleKey = `pcxn.subsite.${key}.sectionTitle`;

      this.headerService.init(
        this.titleKey,
        true,
        true,
        key as MenuActives);

      if (this.modeKey.isPresent())
        this.modeService.getItemShorts(this.modeKey.get() as Modes).then(items => {
          if (Optional.of(this.itemTable).isPresent()) {
            this.items = items;
            if(this.categories.isEmpty()) return;

            this.updateActiveCategory();

            this.itemTable?.updateItems(items);
            this.itemTable?.clearSearch();
          }
        });

    });
  }

  async ngOnInit(): Promise<void> {

    this.headerService.showSearch = true;
    this.headerService.setActivatedCategory(true);

    this.modeService.setActivatedRoute(this.route, this.onModeUpdate.bind(this));
    this.modeKey = ModeService.mode;


    this.translation.subscribe(lang => {
      this.modeService.getCategories(lang).then(categories => {
        this.categories = Optional.of(categories);

        this.updateActiveCategory();

        this.itemTable?.updateItems(this.items);
      });
    });

  }

  updateActiveCategory() {
    if(this.categories.isEmpty()) return;


    const active = this.categories
      .get()
      .find(category => this.modeService.isCategoryActive(category));
    ModeService.activeCategory = active ? Optional.of(active) : Optional.empty();


    this.redirect.jumpToTable();
  }

  ngAfterViewInit(): void {
    //console.log("ModeComponent.ngAfterViewInit")
    this.calcMoonPosition(this.darkMode);

    this.updateActiveCategory();
  }

  private calcMoonPosition(theme: boolean): void {
    if (this.moon == undefined) return;

    if (this.themeService.is(Themes.Auto) && this.themeService.getAutoModeHour().isPresent()) {
      let hour = this.themeService.getAutoModeHour().get();
      let left = 100 / 12 * hour;
      let top = Math.round(6 / 6 * hour - 6);
      this.renderer.setStyle(this.moon.nativeElement, 'left', `${left}%`);
      this.renderer.setStyle(this.moon.nativeElement, 'rotate', `${top}deg`);
      this.renderer.setStyle(this.moon.nativeElement, 'top', `${top > 0 ? top * 2 : top}%`);
    } else {
      this.renderer.setStyle(this.moon.nativeElement, 'left', `50%`);
      this.renderer.setStyle(this.moon.nativeElement, 'rotate', `${0}deg`);
      this.renderer.setStyle(this.moon.nativeElement, 'top', `${0}%`);
    }

  }


}
