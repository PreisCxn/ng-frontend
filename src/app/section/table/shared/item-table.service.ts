import {Injectable} from '@angular/core';
import {ItemRowComponent} from "../item-row/item-row.component";
import {Optional} from "../../../shared/optional";
import {Subject} from "rxjs";
import {ModeService} from "../../../mode/shared/mode.service";

@Injectable({
  providedIn: 'root'
})
export class ItemTableService {

  protected openItem: Optional<ItemRowComponent> = Optional.empty();

  public customMultiplier: number = 1;
  public multiplierChanged: Subject<number> = new Subject<number>();

  constructor(private modeService: ModeService) {
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

  public getCategoryMultiplier(): number {
    return this.modeService.getCurrentCategoryMultiplier();
  }

  setCustomMultiplier(multiplier: number) {
    this.customMultiplier = multiplier;

    this.multiplierChanged.next(multiplier);
  }

}
