import {Injectable} from '@angular/core';
import {ItemRowComponent} from "../item-row/item-row.component";
import {Optional} from "../../../shared/optional";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ItemTableService {

  protected openItem: Optional<ItemRowComponent> = Optional.empty();

  public customMultiplier: number = 1;
  public multiplierChanged: Subject<number> = new Subject<number>();

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

  setCustomMultiplier(multiplier: number) {
    this.customMultiplier = multiplier;

    this.multiplierChanged.next(multiplier);
  }

}
