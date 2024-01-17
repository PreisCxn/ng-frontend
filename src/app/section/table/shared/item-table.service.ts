import { Injectable } from '@angular/core';
import {ItemRowComponent} from "../item-row/item-row.component";

@Injectable({
  providedIn: 'root'
})
export class ItemTableService {

  protected items: ItemRowComponent[] = [];

  constructor() { }

  forceCloseAll() {
    this.closeAllExcept(null);
  }

  public closeAllExcept(itemRow: ItemRowComponent | null) {
    this.items.forEach(item => {
      if(item != itemRow) {
        item.closeItem();
      }
    });
  }

  public registerItem(itemRow: ItemRowComponent) {
    this.items.push(itemRow);
  }

  public unregisterItem(itemRow: ItemRowComponent) {
    const index = this.items.indexOf(itemRow);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

}
