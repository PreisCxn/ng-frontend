import {Injectable, OnInit} from '@angular/core';
import {filter, map} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import { Optional} from "../../shared/optional";

@Injectable({
  providedIn: 'root'
})
export class ModeService{

  private static readonly MODE_KEY: string = "mode";
  private static readonly ITEM_ID_KEY: string = "itemId";

  private route: Optional<ActivatedRoute> = Optional.empty();

  constructor() {
  }

  setActivatedRoute(route: ActivatedRoute) {
    this.route = Optional.of(route);
  }

  private get(key: string): Optional<string> {
    return this.route.map(route => route.snapshot.params[key]);
  }

  getMode(): Optional<string> {
    return this.get(ModeService.MODE_KEY);
  }

  getItemId(): Optional<string> {
    return this.get(ModeService.ITEM_ID_KEY);
  }

}
