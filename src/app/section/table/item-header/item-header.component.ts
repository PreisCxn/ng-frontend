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
    const multiplier = (event.target as HTMLInputElement).value;
    this.itemTableService.setCustomMultiplier(isNaN(Number(multiplier)) ? Number(multiplier) : 1);
  }

}
