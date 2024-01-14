import {Injectable, OnInit} from '@angular/core';
import {filter, map, Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import { Optional} from "../../shared/optional";
import {ModeModule} from "../mode.module";
import {CategoryEntry} from "../../shared/pcxn.types";
import {DataService} from "../../shared/data.service";

@Injectable({
  providedIn: ModeModule
})
export class ModeService {

  private static readonly ALL_CATEGORY: CategoryEntry = {
    pcxnId: -1,
    route: "all",
    translationData: {
      translatableKey: "pcxn.category.all.title",
    },
    inNav: true
  }

  private static readonly CATEGORIES: CategoryEntry[] = [];

  private static readonly MODE_KEY: string = "mode";
  private static readonly ITEM_ID_KEY: string = "itemId";
  private static readonly CATEGORY_KEY: string = "category";

  private route: Optional<ActivatedRoute> = Optional.empty();
  private routeSubscription: Optional<Subscription> = Optional.empty();

  public mode: Optional<string> = this.getMode();
  public itemId: Optional<string> = this.getItemId();
  public category: Optional<string> = this.getCategory();

  constructor(private dataService: DataService) { }

  setActivatedRoute(
    route: ActivatedRoute,
    callback: (mode: Optional<string>,
               itemId: Optional<string>) => void) {

    this.route = Optional.of(route);

    this.routeSubscription = Optional.of(
      this.route.get().params.subscribe(params => {
        this.mode = Optional.of(params[ModeService.MODE_KEY]);
        this.itemId = Optional.of(params[ModeService.ITEM_ID_KEY]);
        callback(this.mode, this.itemId);
      }));

  }

  private get(key: string): Optional<string> {
    return this.route.map(route => route.snapshot.params[key]);
  }

  public async getCategories(): Promise<CategoryEntry[]> {
    return this.dataService.getCategories();
  }

  getMode(): Optional<string> {
    return this.get(ModeService.MODE_KEY);
  }

  getItemId(): Optional<string> {
    return this.get(ModeService.ITEM_ID_KEY);
  }

  getCategory(): Optional<string> {
    return this.get(ModeService.CATEGORY_KEY);
  }

}
