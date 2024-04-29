import {
  AfterViewInit,
  Component, OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {ModeService} from "../shared/mode.service";
import {ActivatedRoute} from "@angular/router";
import {HeaderService, MenuActives} from "../../shared/header.service";
import {Optional} from "../../shared/optional";
import {Modes} from "../shared/modes";
import {HeroModule} from "../../section/hero/hero.module";
import {ParallaxBuilder} from "../../section/hero/shared/parallax.directive";
import {TableModule} from "../../section/table/table.module";
import {NgClass, NgIf, UpperCasePipe} from "@angular/common";
import {TranslationService} from "../../shared/translation.service";
import {ItemTableComponent} from "../../section/table/item-table/item-table.component";
import {RedirectService} from "../../shared/redirect.service";
import {TranslationDirective} from "../../shared/translation.directive";
import {DefaultBGComponent} from "../../section/hero/default-bg/default-bg.component";
import {JumpButtonComponent} from "../../section/hero/jump-button/jump-button.component";
import {CategoryNavComponent} from "../../section/hero/category-nav/category-nav.component";
import {HeadingComponent} from "../../section/hero/heading/heading.component";
import {Subscription} from "rxjs";
import {CategoryEntry} from "../../shared/types/categories.types";
import {ItemShortInfo} from "../../shared/types/item.types";

@Component({
  selector: 'app-mode',
  standalone: true,
  imports: [
    HeroModule,
    TableModule,
    NgIf,
    NgClass,
    UpperCasePipe,
    TranslationDirective,
    DefaultBGComponent
  ],
  templateUrl: './mode.component.html',
  styleUrl: './mode.component.scss'
})
export class ModeComponent implements OnInit, AfterViewInit, OnDestroy {

  public modeKey: Optional<string> = Optional.empty();

  @ViewChild('table') itemTable: ItemTableComponent | null = null;

  protected items: ItemShortInfo[] | null = null;

  protected titleKey: string = "";

  protected categories: Optional<CategoryEntry[]> = Optional.empty();

  private updateCatsSubscription: Subscription | null = null;

  private lastMode: Optional<string> = Optional.empty();

  public headingParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.5)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
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

  constructor(private modeService: ModeService,
              private route: ActivatedRoute,
              private headerService: HeaderService,
              private redirect: RedirectService,
              private renderer: Renderer2,
              private translation: TranslationService) {
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

      this.headerService.initHeaderCategories(
        this.categories.orElse([]),
        this.onCategoryClick.bind(this),
        this.isActive.bind(this));

      if (this.modeKey.isPresent())
        this.modeService.getItemShorts(this.modeKey.get() as Modes).then(items => {
          if (Optional.of(this.itemTable).isPresent()) {
            this.items = items;
            if (this.categories.isEmpty()) return;

            this.updateActiveCategory();

            this.itemTable?.updateItems(items);
            this.itemTable?.clearSearch();
          }
        });

      if(this.lastMode.isPresent() && this.lastMode.get() != this.modeKey.get()) {
        this.redirect.scrollToTop(false);
        this.redirect.setQueryParams({search: null}, true);
      }

      if(this.lastMode.isEmpty() && this.modeKey.isPresent())
        this.redirect.scrollToTop(false);

      this.lastMode = this.modeKey;

    });
  }

  async ngOnInit(): Promise<void> {

    this.headerService.showSearch = true;
    this.headerService.setActivatedCategory(true);

    this.modeService.setActivatedRoute(this.route, this.onModeUpdate.bind(this));
    this.modeKey = ModeService.mode;


     this.updateCatsSubscription = this.translation.subscribe(lang => {
      this.modeService.getCategories(lang).then(categories => {
        this.categories = Optional.of(categories);
        this.headerService.Categories = categories;

        this.updateActiveCategory();

        this.itemTable?.updateItems(this.items);
      });
    });

  }

  updateActiveCategory() {
    if (this.categories.isEmpty()) return;


    const active = this.categories
      .get()
      .find(category => this.modeService.isCategoryActive(category));
    ModeService.activeCategory = active ? Optional.of(active) : Optional.empty();


    this.redirect.jumpToTable();
  }

  ngAfterViewInit(): void {
    this.updateActiveCategory();
    this.redirect.resetQueryParam('id')
  }

  protected onCategoryClick(category: CategoryEntry) {
    this.modeService.redirectToCategory(category)
  }

  protected isActive(category: CategoryEntry): boolean {
    return this.modeService.isCategoryActive(category);
  }

  protected readonly JumpButtonComponent = JumpButtonComponent;
  protected readonly CategoryNavComponent = CategoryNavComponent;
  protected readonly HeadingComponent = HeadingComponent;

  ngOnDestroy(): void {
    if(this.updateCatsSubscription)
      this.updateCatsSubscription.unsubscribe();
  }

  getTitle(): string {
    return this.translation.getTranslation(this.titleKey);
  }
}
