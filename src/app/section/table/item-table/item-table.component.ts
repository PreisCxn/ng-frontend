import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'section-item-table',
  templateUrl: './item-table.component.html',
  styleUrl: './item-table.component.scss'
})
export class ItemTableComponent {
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  protected isSmallScreen() {
    return window.innerWidth < 768; // Sie können den Schwellenwert an Ihre Anforderungen anpassen
  }

}
