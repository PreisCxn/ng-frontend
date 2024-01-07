import { Injectable } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslationService} from "./translation.service";
import {startWith, Subscription} from "rxjs";
import {Optional} from "./optional";
import {ThemeService} from "./theme.service";
import {Modes} from "../mode/shared/modes";
import {HeaderComponent} from "../header/header.component";

export enum MenuActives {
  HOME = "pcxn::home",
  MOD = "pcxn::mod",
  IMPRINT = "pcxn::imprint",
  SKYBLOCK = Modes.SKYBLOCK,
  CITYBUILD = Modes.CITYBUILD
}

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  headerComponent: Optional<HeaderComponent> = Optional.empty();
  private static readonly siteTitle:string = "PriceCxn"
  private sectionTitle: Optional<string> = Optional.empty();
  private titleSubscription: Subscription | null = null;

  public showSearch: boolean = false;

  private searchKey: string = "";

  public activeMenuItem:Optional<MenuActives> = Optional.empty();

  public categoryActivated: boolean = false;

  constructor(private titleService: Title, private translation: TranslationService) {
    this.clearSectionTitle();
  }

  public setSectionTitle(title: string): void {
    this.sectionTitle = Optional.of(title);
    if(this.sectionTitle.isEmpty() || this.sectionTitle.get().length == 0)
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
  }

  public forceCloseMenus(): void {
    if(this.headerComponent.isPresent()) {
      this.headerComponent.get().closeAllMenus();
    }
  }

  public setSectionTitleByLanguageKey(key: string): void {
    console.log(key);
    this.searchKey = key;
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
    this.titleSubscription = this.translation.pipe(startWith(null)).subscribe(language => {
      this.setSectionTitle(this.translation.getTranslation(this.searchKey));
    });
  }

  public onSearchInput(input: string): void {
    console.log(input)
  }

  public clearSectionTitle(): void {
    this.setSectionTitle("");
  }

  public setActivatedCategory(bool: boolean): void {
    this.categoryActivated = bool;
  }

  public setActiveMenuItem(menuItem: MenuActives | null = null): void {
    if(menuItem == null)
      this.activeMenuItem = Optional.empty();
    else
      this.activeMenuItem = Optional.of(menuItem);
  }

  public activeMenuIs(menu: MenuActives): boolean {
    return this.activeMenuItem.isPresent() && this.activeMenuItem.get() == menu;
  }

  public resetSearchInput(): void {
    if(this.headerComponent.isPresent())
      this.headerComponent.get().searchInput = "";
  }



}
