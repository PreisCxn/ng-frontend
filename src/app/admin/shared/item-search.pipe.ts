import { Pipe, PipeTransform } from '@angular/core';
import {ItemData} from "../../shared/types/item.types";

@Pipe({
  name: 'itemSearch',
  standalone: true
})
export class ItemSearchPipe implements PipeTransform {

  transform(items: ItemData[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText || searchText === "") return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return Object.values(item).some(val => {
        if(val === null || val === undefined) return false;
        if (Array.isArray(val)) {
          return val.some(mode =>
            Object.values(mode).some(modeVal =>
              modeVal.toString().toLowerCase().includes(searchText)
            )
          );
        }
        return val.toString().toLowerCase().includes(searchText);
      });
    });
  }

}
