import {AfterViewInit, Component, Inject, Input, OnChanges, PLATFORM_ID, SimpleChanges} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {Optional} from "../../../shared/optional";
import {HeaderService} from "../../../shared/header.service";
import {TranslationService} from "../../../shared/translation.service";
import {ModeService} from "../../../mode/shared/mode.service";
import {ItemShortInfo} from "../../../shared/types/item.types";

@Component({
  selector: 'section-item-table',
  templateUrl: './item-table.component.html',
  styleUrl: './item-table.component.scss',
})
export class ItemTableComponent implements AfterViewInit {
  isBrowser: boolean;
  @Input() items: ItemShortInfo[] | null = null;

  protected filteredItems: ItemShortInfo[] | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private headerService: HeaderService,
    private translation: TranslationService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.headerService.setSearchInoutAction(this.updateFilter.bind(this));
  }

  protected isSmallScreen() {
    return window.innerWidth < 768; // Sie können den Schwellenwert an Ihre Anforderungen anpassen
  }

  public updateFilter(input: string = this.headerService.searchInput) {
    if (this.items == null) return;


    if (input === "" || !input) {
      this.filteredItems = this.items;
      return;
    }

    this.filteredItems = this.items
      .filter(item => item.translation
        .some(value => {
          return value.translation && value.translation
            .toLowerCase()
            .includes(input.toLowerCase())
        })
      );

    this.sortName();
  }

  public sortName(items: ItemShortInfo[] | null = this.filteredItems) {
    if (items == null) return;

    const lang = this.translation.getCurrentLanguage();

    items.sort((a, b) => {
      const nameA = TranslationService.ifTranslationUndefinedBackup(a.translation, lang);
      const nameB = TranslationService.ifTranslationUndefinedBackup(b.translation, lang);

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  filterCategory() {

    let items = this.items;

    const categoryId = ModeService.activeCategory.isPresent() ?
      ModeService.activeCategory.get().pcxnId : ModeService.ALL_CATEGORY.pcxnId;

    if (categoryId != ModeService.ALL_CATEGORY.pcxnId) {
      if (items != null)
        items = items.filter(item => item.categoryIds.includes(categoryId));
    }

    this.items = items;
  }

  updateItems(items: ItemShortInfo[] | null) {
    this.items = items;
    this.filterCategory();
    this.sortName(this.items);
    this.updateFilter();
  }

  clearSearch() {
    this.headerService.resetSearchInput();
    this.updateFilter("");
  }

  protected readonly Optional = Optional;

  ngAfterViewInit(): void {
    this.updateFilter("");
  }
}
