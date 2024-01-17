import {Injectable} from '@angular/core';
import {ItemRowComponent} from "../item-row/item-row.component";
import {Optional} from "../../../shared/optional";

@Injectable({
  providedIn: 'root'
})
export class ItemTableService {

  protected openItem: Optional<ItemRowComponent> = Optional.empty();

  constructor() {
  }

  public toggleItemRow(itemRow: ItemRowComponent) {
    if (this.openItem.isPresent() && this.openItem.get() === itemRow) {
      itemRow.toggleItem();
      this.openItem = Optional.empty();
    } else {
      this.openItem.ifPresent(item => item.closeItem());
      itemRow.openItem();
      this.openItem = Optional.of(itemRow);
    }
  }

}
