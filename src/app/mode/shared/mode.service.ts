import {Injectable} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Optional} from "../../shared/optional";
import {ModeModule} from "../mode.module";
import {DataService} from "../../shared/data.service";
import {Modes} from "./modes";
import {TranslationService} from "../../shared/translation.service";
import {RedirectService} from "../../shared/redirect.service";
import {Languages} from "../../shared/languages";
import {Http} from "../../shared/http";
import {CategoryEntry} from "../../shared/types/categories.types";
import {ItemExtendedInfo, ItemShortInfo} from "../../shared/types/item.types";

@Injectable({
  providedIn: "root"
})
export class ModeService {

  public static readonly ALL_CATEGORY: CategoryEntry = {
    pcxnId: -1,
    route: "/all",
    translationData: {
      translatableKey: "pcxn.category.all.title",
    },
    inNav: true
  }

  public static CATEGORIES: CategoryEntry[] = [];

  private static readonly MODE_KEY: string = "mode";
  private static readonly ITEM_ID_KEY: string = "id";
  private static readonly CATEGORY_KEY: string = "category";

  private route: Optional<ActivatedRoute> = Optional.empty();
  private routeSubscription: Optional<Subscription> = Optional.empty();

  public static mode: Optional<string> = Optional.empty();
  public static itemId: Optional<string> = Optional.empty();
  public static category: Optional<string> = Optional.empty();
  public static activeCategory: Optional<CategoryEntry> = Optional.empty();

  private currentExtendedItem: Optional<ItemExtendedInfo> = Optional.empty();

  constructor(private dataService: DataService,private translation: TranslationService, private redirect: RedirectService) {
    ModeService.mode = this.getMode();
    ModeService.itemId = this.getItemId();
    ModeService.category = this.getCategory();
  }

  setActivatedRoute(
    route: ActivatedRoute,
    callback: (mode: Optional<string>,
               itemId: Optional<string>) => void) {

    this.route = Optional.of(route);

    this.routeSubscription = Optional.of(
      this.route.get().params.subscribe(params => {
        ModeService.mode = Optional.of(params[ModeService.MODE_KEY]);
        ModeService.itemId = this.getQuery(ModeService.ITEM_ID_KEY);
        ModeService.category = Optional.of(params[ModeService.CATEGORY_KEY]);
        callback(ModeService.mode, ModeService.itemId);
      }));

  }

  private get(key: string): Optional<string> {
    return this.route.map(route => route.snapshot.params[key]);
  }

  private getQuery(key: string): Optional<string> {
    return this.route.map(route => route.snapshot.queryParams[key])
  }

  public setItemExtendedInfo(item: ItemExtendedInfo | null) {
    this.currentExtendedItem = Optional.of(item);
  }

  public getItemExtendedInfo(): Optional<ItemExtendedInfo> {
    return this.currentExtendedItem;
  }

  public async getCategories(lang: Languages, test: boolean = Http.isTESTING, refresh: boolean = false): Promise<CategoryEntry[]> {
    return await this.dataService.getCategoriesUsingLang(lang, refresh).then(categories => {
      ModeService.CATEGORIES = [];
      ModeService.CATEGORIES.push(ModeService.ALL_CATEGORY)
      ModeService.CATEGORIES.push(...categories);
      return ModeService.CATEGORIES;
    });
  }

  public async getExtendedItem(itemId: string, mode: Modes,lang: Languages = this.translation.getCurrentLanguage()): Promise<ItemExtendedInfo> {
    return await this.dataService.getItemExtendedInfo(itemId, mode);
  }

  public async getItemShorts(mode: Modes): Promise<ItemShortInfo[]> {
    return await this.dataService.getItemShortInfo(mode);
  }

  getMode(): Optional<string> {
    return this.get(ModeService.MODE_KEY);
  }

  getItemId(): Optional<string> {
    return this.getQuery(ModeService.ITEM_ID_KEY);
  }

  getCategory(): Optional<string> {
    return this.get(ModeService.CATEGORY_KEY);
  }

  getCurrentMode(): Modes {
    return ModeService.mode.orElse('') as Modes;
  }

  public getCategoryName(category: CategoryEntry): string {
    return 'translatableKey' in category.translationData ? this.translation.getTranslation(category.translationData.translatableKey) : category.translationData.translation;
  }

  public redirectToCategory(category: CategoryEntry): void {
    this.redirect.redirectToCategory(this.getCurrentMode(), category)

    const cat = ModeService.activeCategory;
    if(cat.isPresent() || category.pcxnId == cat.get().pcxnId) {
      this.redirect.jumpToTable(true);
    }
  }

  public isCategoryActive(category: CategoryEntry): boolean {
    return ModeService.category.orElse('') == category.route.slice(1, category.route.length);
  }

}
