import {Component, Inject, Input, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {Optional} from "../../../shared/optional";
import {ItemShortInfo} from "../../../shared/pcxn.types";

@Component({
  selector: 'section-item-table',
  templateUrl: './item-table.component.html',
  styleUrl: './item-table.component.scss'
})
export class ItemTableComponent {
  isBrowser: boolean;

  protected itemInfo: ItemShortInfo = {
    modeKey: '',
    itemUrl: '',
    imageUrl: '',
    translation: [
      {
        language: 'en',
        translation: 'HI',
      },
      {
        language: 'de',
        translation: 'HIIIIII',
      },
    ],
    minPrice: 100,
    maxPrice: 1000,
    categoryIds: [],
    animationUrl: '',
    sellingUser: [],
    buyingUser: [],
  };

  @Input() items: ItemShortInfo[] | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  protected isSmallScreen() {
    return window.innerWidth < 768; // Sie können den Schwellenwert an Ihre Anforderungen anpassen
  }

  protected readonly Optional = Optional;
}
