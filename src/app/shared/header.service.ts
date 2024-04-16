import {Injectable} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslationService} from "./translation.service";
import {startWith, Subscription} from "rxjs";
import {Optional} from "./optional";
import {ThemeService} from "./theme.service";
import {Modes} from "../mode/shared/modes";
import {HeaderComponent} from "../header/header.component";
import {ModeService} from "../mode/shared/mode.service";
import {CategoryEntry} from "./types/categories.types";
import {Translation, TranslationType} from "./types/translation.types";
import {ActivatedRoute, Router} from "@angular/router";
import {RedirectService} from "./redirect.service";

export enum MenuActives {
  HOME = "pcxn::home",
  MOD = "pcxn::mod",
  IMPRINT = "pcxn::imprint",
  SKYBLOCK = Modes.SKYBLOCK,
  CITYBUILD = Modes.CITYBUILD
}

export type HeaderBreadCrumb = {
  url: string,
  shortKey: string,
  translationKey: string
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  headerComponent: Optional<HeaderComponent> = Optional.empty();
  private static readonly siteTitle: string = "PriceCxn"
  private sectionTitle: Optional<string> = Optional.empty();
  private titleSubscription: Subscription | null = null;

  public showSearch: boolean = false;

  public Categories: CategoryEntry[] = [];

  private searchKey: string = "";
  private searchInputAction: Optional<(input: string) => void> = Optional.empty();

  public searchInput: string = "";

  public activeMenuItem: Optional<MenuActives> = Optional.empty();

  public categoryActivated: boolean = false;

  public categories: Optional<CategoryEntry[]> = Optional.empty();

  public onCategoryClick: (category: CategoryEntry) => void = () => {
  };
  public isCategoryActive: (category: CategoryEntry) => boolean = () => false;

  public breadCrumb: Optional<HeaderBreadCrumb> = Optional.empty();

  constructor(private titleService: Title,
              private translation: TranslationService,
              private router: Router,
              private route: ActivatedRoute,
              private redirect: RedirectService) {
    this.clearSectionTitle();
  }

  public setSectionTitle(title: string): void {
    this.sectionTitle = Optional.of(title);
    if (this.sectionTitle.isEmpty() || this.sectionTitle.get().length == 0)
      this.titleService.setTitle(HeaderService.siteTitle);
    else
      this.titleService.setTitle(this.sectionTitle.get() + " | " + HeaderService.siteTitle);
  }

  public setHeaderComponent(headerComponent: HeaderComponent): void {
    this.headerComponent = Optional.of(headerComponent);
  }

  public init(sectionTitleKey: string, isCategoryActive: boolean, isSearchActive: boolean, activeMenu: MenuActives | null = null): void {
    this.setSectionTitleByLanguageKey(sectionTitleKey)
    this.setActiveMenuItem(activeMenu);
    this.setActivatedCategory(isCategoryActive);
    this.showSearch = isSearchActive;

    this.forceCloseMenus();
    this.resetSearchInput();
    this.translation.triggerRecalculation();
    this.breadCrumb = Optional.empty();
  }

  public initHeaderCategories(categories: CategoryEntry[], onCategoryClick: (category: CategoryEntry) => void, isCategoryActive: ((category: CategoryEntry) => boolean) | null): void {
    this.Categories = categories;
    this.onCategoryClick = onCategoryClick;
    isCategoryActive === null ? this.isCategoryActive = () => false : this.isCategoryActive = isCategoryActive;
  }

  public setBreadCrumb(breadCrumb: HeaderBreadCrumb): void {
    this.breadCrumb = Optional.of(breadCrumb);
  }

  public setModeBreadCrumb(mode: Modes): void {

    let shortKey: string | null = null;
    let translationKey: string | null = null;

    switch (mode) {
      case Modes.SKYBLOCK:
        shortKey = "pcxn.subsite.skyblock.shorter";
        translationKey = "pcxn.subsite.skyblock.sectionTitle"
        break;
      case Modes.CITYBUILD:
        shortKey = "pcxn.subsite.citybuild.shorter";
        translationKey = "pcxn.subsite.citybuild.sectionTitle"
        break;
      default:
        break;
    }

    if (shortKey === null || translationKey === null) return;

    let breadCrumb: HeaderBreadCrumb = {
      url: mode.toLowerCase(),
      shortKey: shortKey,
      translationKey: translationKey
    }
    this.setBreadCrumb(breadCrumb);
  }

  public hasBreadCrumb(): boolean {
    return this.breadCrumb.isPresent();
  }

  public forceCloseMenus(): void {
    if (this.headerComponent.isPresent()) {
      this.headerComponent.get().closeAllMenus();
    }
  }

  public setSectionTitleByLanguageKey(key: string): void {
    this.searchKey = key;
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
    this.titleSubscription = this.translation.pipe(startWith(null)).subscribe(language => {
      this.setSectionTitle(this.translation.getTranslation(this.searchKey));
    });
  }

  public onSearchInput(input: string): void {
    this.searchInput = input;

    if (this.searchInputAction.isPresent())
      this.searchInputAction.get()(input);

    this.redirect.setQueryParams({
      search: this.searchInput == "" ? null : this.searchInput,
      id: this.route.snapshot.queryParams['id'] || null
    });

  }

  public setSearchInoutAction(action: (input: string) => void): void {
    this.searchInputAction = Optional.of(action);
  }

  public clearSectionTitle(): void {
    this.setSectionTitle("");
  }

  public setActivatedCategory(bool: boolean): void {
    this.categoryActivated = bool;
  }

  public setActiveMenuItem(menuItem: MenuActives | null = null): void {
    if (menuItem == null)
      this.activeMenuItem = Optional.empty();
    else
      this.activeMenuItem = Optional.of(menuItem);
  }

  public activeMenuIs(menu: MenuActives): boolean {
    return this.activeMenuItem.isPresent() && this.activeMenuItem.get() == menu;
  }

  public resetSearchInput(): void {
    if (this.headerComponent.isEmpty()) return;
    const params = this.route.snapshot.queryParams;
    if (params['search']) {
        this.headerComponent.get().searchInput = params['search'];
    } else {
        this.headerComponent.get().searchInput = "";
    }

    this.onSearchInput(this.headerComponent.get().searchInput);
  }

  public getBreadCrumbUrl(): string {
    if (this.breadCrumb.isEmpty()) return "/";
    return this.breadCrumb.get().url;
  }

  public getBreadCrumbShortKey(): string {
    if (this.breadCrumb.isEmpty()) return "";
    return this.breadCrumb.get().shortKey;
  }

  public getBreadCrumbTranslationKey(): string {
    if (this.breadCrumb.isEmpty()) return "";
    return this.breadCrumb.get().translationKey;
  }

  public getBreadCrumbText(): string {
    if (this.breadCrumb.isEmpty()) return "";
    if (window.innerWidth < 1280) {
      return this.translation.getTranslation(this.getBreadCrumbShortKey());
    } else {
      return this.translation.getTranslation(this.getBreadCrumbTranslationKey());
    }
  }

}
