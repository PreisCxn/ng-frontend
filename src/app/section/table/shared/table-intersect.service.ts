import {Injectable} from '@angular/core';
import {ItemRowComponent} from "../item-row/item-row.component";
import {Optional} from "../../../shared/optional";

@Injectable({
  providedIn: 'root'
})
export class TableIntersectService {

  private static readonly OBSERVER_COUNT = 1;

  private observer: IntersectionObserver[] = [];

  private itemRowComponents: Map<number, ItemRowComponent> = new Map<number, ItemRowComponent>();
  private currentObserverIndex = 0;

  constructor() {
    for (let i = 0; i < TableIntersectService.OBSERVER_COUNT; i++)
      this.observer.push(this.createObserver());
  }

  private debounceTimer: any = null;

  private createObserver(): IntersectionObserver {
    return new IntersectionObserver(this.handleIntersect.bind(this), {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    })
  }

  public observeItemRow(itemRow: ItemRowComponent) {
    const itemId = itemRow.getItemId();
    itemId.ifPresentOrElse(id => {
      this.itemRowComponents.set(id, itemRow);
      itemRow.getRowElement().ifPresentOrElse(rowElement => {
        this.observer[this.currentObserverIndex].observe(rowElement);
        this.currentObserverIndex = (this.currentObserverIndex + 1) % this.observer.length;
      }, () => {
        console.error('No row element found for itemRow: ', itemRow);
      })
    }, () => {
      console.error('No item id found for itemRow: ', itemRow);
    });
  }

  private isIntersecting(entry: IntersectionObserverEntry): boolean {
    return entry.isIntersecting || entry.intersectionRatio > 0;
  }

  public unobserveAll() {
    this.observer.forEach(observer => observer.disconnect());
    this.itemRowComponents.clear();
  }

  public unobserveItemRow(itemRow: ItemRowComponent) {
    const itemId = itemRow.getItemId();
    itemId.ifPresentOrElse(id => {
      this.itemRowComponents.delete(id);
      itemRow.getRowElement().ifPresentOrElse(rowElement => {
        this.observer.forEach(observer => observer.unobserve(rowElement));
      }, () => {
        console.error('No row element found for itemRow: ', itemRow);
      })
    }, () => {
      console.error('No item id found for itemRow: ', itemRow);
    });
  }

  private handleIntersect(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      const entryId = this.getEntryId(entry);
      if (entryId === undefined) return;

      const itemRow: ItemRowComponent | undefined = this.findItemRowComponent(entryId);
      if (itemRow === undefined) return;

      if (this.isIntersecting(entry)) {
        itemRow.showRow();
      } else
        itemRow.hideRow();
    });
  }

  private getEntryId(entry: IntersectionObserverEntry): number | undefined {
    if (!entry.target.parentElement?.id) {
      console.error('No id found for entry target: ', entry.target);
      return undefined;
    }
    const id = Number(entry.target.parentElement?.id);
    if (isNaN(id)) {
      console.error('Invalid id found for entry target: ', entry.target);
      return undefined;
    }
    return id;
  }

  private findItemRowComponent(id: number): ItemRowComponent | undefined {
    const itemRow = this.itemRowComponents.get(id);
    if (!itemRow) {
      console.error('ItemRowComponent not found for id ' + id);
      return undefined;
    }
    return itemRow;
  }

}
