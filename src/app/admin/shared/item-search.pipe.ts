import {Pipe, PipeTransform} from '@angular/core';
import {ItemData} from "../../shared/types/item.types";
import {compileResults} from "@angular/compiler-cli/src/ngtsc/annotations/common";
import {AdminService} from "./admin.service";
import {Optional} from "../../shared/optional";

export type ItemDataSearch = [itemData: ItemData, searchData:string[]]

@Pipe({
  name: 'itemSearch',
  standalone: true
})
export class ItemSearchPipe implements PipeTransform {

  constructor(private admin: AdminService) {
  }

  transform(item: ItemData[] | undefined, searchText: string, exclude: ItemData | undefined = undefined): ItemData[] {

    const searches = item ? Optional.of(this.admin.getItemDataSearches(item)) : this.admin.ITEM_DATA_SEARCH;

    if(searches.isEmpty()) return [];

    const searchData = exclude ? searches.get().filter(i => exclude.pcxnId !== i[0].pcxnId) : searches.get();

    if (!searchText || searchText === "") return searchData.map(s => s[0]);

    // Teilen Sie den searchText an ;+ und wandeln Sie jeden Suchbegriff in Kleinbuchstaben um
    const searchTerms = searchText.split(';+').map(term => term.toLowerCase());

    // Ignorieren Sie leere Suchbegriffe
    const validSearchTerms = searchTerms.filter(term => term !== "");

    return searchData.filter(s =>
      // Prüfen Sie, ob alle Suchbegriffe in den Daten enthalten sind
      validSearchTerms.every(term => s[1].some(data => data.includes(term)))
    ).map(s => s[0]);
  }

}
