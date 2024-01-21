import {AfterViewInit, Component, Inject, Input, OnChanges, PLATFORM_ID, SimpleChanges} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {Optional} from "../../../shared/optional";
import {ItemShortInfo} from "../../../shared/pcxn.types";
import {HeaderService} from "../../../shared/header.service";

@Component({
  selector: 'section-item-table',
  templateUrl: './item-table.component.html',
  styleUrl: './item-table.component.scss'
})
export class ItemTableComponent implements AfterViewInit {
  isBrowser: boolean;
  @Input() items: ItemShortInfo[] | null = null;

  protected filteredItems: ItemShortInfo[] | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private headerService: HeaderService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.headerService.setSearchInoutAction(this.updateFilter.bind(this));
  }

  protected isSmallScreen() {
    return window.innerWidth < 768; // Sie können den Schwellenwert an Ihre Anforderungen anpassen
  }

  public updateFilter(input: string = this.headerService.searchInput) {
    console.log("items: " + this.items)
    if (this.items == null) return;

    console.log("Input: " + input)

    if(input == "") {
      this.filteredItems = this.items;
      return;
    }

    this.filteredItems = this.items
      .filter(item => item.translation
        .some(value => {
          console.log(value.translation)
          console.log(input)
          return value.translation
            .toLowerCase()
            .includes(input.toLowerCase())
        })
      )

    console.log(this.filteredItems)
  }

  updateItems(items: ItemShortInfo[] | null) {
    this.items = items;
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
