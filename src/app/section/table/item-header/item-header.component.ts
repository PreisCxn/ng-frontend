import { Component } from '@angular/core';
import {ItemTableService} from "../shared/item-table.service";

@Component({
  selector: 'table-item-header',
  templateUrl: './item-header.component.html',
  styleUrl: './item-header.component.scss'
})
export class ItemHeaderComponent {

  constructor(private itemTableService: ItemTableService) {

  }

  protected setCustomMultiplier(event: Event) {

    let multiplier = Number((event.target as HTMLInputElement).value);

    multiplier = Math.min(multiplier, 9999999);

    if(isNaN(multiplier)) {
      multiplier = 1;
    }

    (event.target as HTMLInputElement).value = String(multiplier);

    this.itemTableService.setCustomMultiplier(multiplier);
  }

  protected isSmallScreen() {
    return window.innerWidth < 768; // Sie können den Schwellenwert an Ihre Anforderungen anpassen
  }

}
