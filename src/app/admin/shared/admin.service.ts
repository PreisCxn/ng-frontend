import {Injectable} from '@angular/core';
import {ModeService} from "../../mode/shared/mode.service";
import {Languages} from "../../shared/languages";
import {ModData} from "../../shared/types/mod.types";
import {Optional} from "../../shared/optional";
import {DataService} from "../../shared/data.service";
import {Category, CategoryCreation} from "../../shared/types/categories.types";
import {ItemChanges, ItemData, ItemReport, PriceSetter, SellBuyReq} from "../../shared/types/item.types";
import {BehaviorSubject} from "rxjs";
import {Translation} from "../../shared/types/translation.types";
import {ItemDataSearch} from "./item-search.pipe";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public MOD_SETTINGS: Optional<ModData> = Optional.empty();

  public CATEGORY_SETTINGS: Optional<Category[]> = Optional.empty();

  public SELL_BUY_REQUESTS: Optional<SellBuyReq[]> = Optional.empty();

  public NOTIFICATIONS: number = 0;

  public SELL_BUY_REQUESTS_COUNT: number = 0;

  public SERVER_MAINTENANCE: boolean = false;

  public ITEM_REPORT_COUNT: number = 0;

  public ITEM_REPORTS: Optional<ItemReport[]> = Optional.empty();

  public ITEM_DATA: Optional<ItemData[]> = Optional.empty();
  public ITEM_DATA_SEARCH: Optional<ItemDataSearch[]> = Optional.empty();
  public ALL_ITEMS: Optional<ItemData[]> = Optional.empty();
  public NEW_ITEM_COUNT: number = 0;
  public NEW_ITEMS: Optional<ItemData[]> = Optional.empty();
  public ITEM_CONNECTIONS: Optional<ItemData[]> = Optional.empty();
  public BLOCKED_ITEMS: Optional<ItemData[]> = Optional.empty();

  private itemDataSubject: BehaviorSubject<ItemData[]> = new BehaviorSubject<ItemData[]>([]);

  constructor(private mode: ModeService, private data: DataService) {
    this.getSellBuyRequests().then(requests => {
      this.SELL_BUY_REQUESTS_COUNT = requests.length;
    });
    this.getServersMaintenance().then(maintenance => {
      this.SERVER_MAINTENANCE = maintenance;
    });
    this.getItemData().then(items => {
      this.getItemReports().then(reports => {
        this.ITEM_REPORT_COUNT = reports.length;
      });
    });
  }

  getCategories(language: Languages) {
    return this.mode.getCategories(language, false, true);
  }

  addSellerBuyer(id: number, mode: string, name: string, type: 'seller' | 'buyer') {
    return this.data.addSellerBuyer(id, {
      modeKey: mode,
      userName: name,
      isSelling: type === 'seller'
    }).then(i => this.updateItemData(i)).catch(e => {
      throw e;
    });
  }

  removeSellerBuyer(id: number, mode: string, name: string, type: 'seller' | 'buyer') {
    return this.data.deleteSellerBuyer(id, {
      modeKey: mode,
      userName: name,
      isSelling: type === 'seller'
    }).then(i => this.updateItemData(i)).catch(e => {
      throw e;
    });
  }

  private async updateItemData(item: ItemData) {
    let items = this.ITEM_DATA.get();
    let index = items.findIndex(i => i.pcxnId === item.pcxnId);
    if (index !== -1) {
      items[index] = item;
      this.sortItemData();
      this.itemDataSubject.next(items);
    } else {
      await this.getItemData().catch(e => {
        throw e;
      });
    }
    return items;
  }

  getSellBuyRequests() {
    return this.data.getSellBuyRequests().then(requests => {
      this.SELL_BUY_REQUESTS = Optional.of(requests);
      this.SELL_BUY_REQUESTS_COUNT = requests.length;
      return requests;
    });
  }

  getItemReports() {
    return this.data.getItemReports().then(reports => {
      this.ITEM_REPORTS = Optional.of(reports);
      this.ITEM_REPORT_COUNT = reports.length;
      return reports;
    });
  }

  deleteItemReport(report: number) {
    return this.data.deleteItemReport(report).then(bool => {
      if (bool) {
        let reportsArray = this.ITEM_REPORTS.get();
        let reportIndex = reportsArray.findIndex(rep => rep.id === report);
        if (reportIndex !== -1) {
          reportsArray.splice(reportIndex, 1);
        }
        this.ITEM_REPORT_COUNT--;
      } else {
        throw new Error('Report could not be deleted');
      }
    }).catch(e => {
      throw e;
    });
  }

  acceptSellBuyRequest(index: number) {
    return this.data.acceptSellBuyRequest(index.toString()).then(bool => {
      if (bool) {
        let sellBuyRequestsArray = this.SELL_BUY_REQUESTS.get();
        let requestIndex = sellBuyRequestsArray.findIndex(req => req.id === index);
        if (requestIndex !== -1) {
          sellBuyRequestsArray.splice(requestIndex, 1);
        }
        this.SELL_BUY_REQUESTS_COUNT--;
      } else {
        throw new Error('SellBuyReq could not be accepted');
      }
    }).catch(e => {
      throw e;
    });
  }

  declineSellBuyRequest(index: number) {
    return this.data.declineSellBuyRequest(index.toString()).then(bool => {
      if (bool) {
        let sellBuyRequestsArray = this.SELL_BUY_REQUESTS.get();
        let requestIndex = sellBuyRequestsArray.findIndex(req => req.id === index);
        if (requestIndex !== -1) {
          sellBuyRequestsArray.splice(requestIndex, 1);
        }
        this.SELL_BUY_REQUESTS_COUNT--;
      } else {
        throw new Error('SellBuyReq could not be declined');
      }
    }).catch(e => {
      throw e;
    });
  }

  getModSettings() {
    if (this.MOD_SETTINGS.isPresent()) {
      return Promise.resolve(this.MOD_SETTINGS.get());
    }
    return this.data.getModData().then(mod => {
      this.MOD_SETTINGS = Optional.of(mod);
      return mod;
    });
  }

  updateModSettings(mod: Partial<ModData>) {
    return this.data.saveModData(mod)
      .then(mod => {
        this.MOD_SETTINGS = Optional.of(mod);
        return mod;
      }).catch(e => {
        throw e;
      });
  }

  getCategoriesSettings() {
    if (this.CATEGORY_SETTINGS.isPresent()) {
      return Promise.resolve(this.CATEGORY_SETTINGS.get());
    }
    return this.data.getCategoryData().then(categories => {
      this.CATEGORY_SETTINGS = Optional.of(categories);
      return categories;
    });
  }

  deleteCategory(category: Category) {
    return this.data.deleteCategory(category).then(bool => {
      if (bool) {
        if (this.CATEGORY_SETTINGS.isPresent()) {
          this.CATEGORY_SETTINGS.get().splice(this.CATEGORY_SETTINGS.get().indexOf(category), 1);
        }
        this.getItemData().catch(e => {
          throw e;
        });
      }
    }).catch(e => {
      throw e;
    });
  }

  createCategory(category: CategoryCreation) {
    return this.data.createCategory(category).then(cat => {
      if (this.CATEGORY_SETTINGS.isPresent()) {
        this.CATEGORY_SETTINGS.get().push(cat);
      }
      return cat;
    }).catch(e => {
      throw e;
    });
  }

  updateCategory(category: Partial<Category>) {
    return this.data.updateCategory(category).then(cat => {
      if (this.CATEGORY_SETTINGS.isPresent()) {
        const index = this.CATEGORY_SETTINGS.get().findIndex(c => c.pcxnId === category.pcxnId);
        if (index !== -1) {
          this.CATEGORY_SETTINGS.get()[index] = cat;
        } else {
          throw new Error('Category not found');
        }
      }
      return cat;
    }).catch(e => {
      throw e;
    });
  }

  getServersMaintenance() {
    return this.data.isWebMaintenance().then(maintenance => {
      this.SERVER_MAINTENANCE = maintenance;
      return maintenance;
    });
  }

  toggleServerMaintenance() {
    if (this.SERVER_MAINTENANCE) {
      return this.goWebOnline();
    } else
      return this.goWebMaintenance();

  }

  goWebMaintenance() {
    return this.data.goWebOffline()
      .then(maintenance => {
        this.SERVER_MAINTENANCE = maintenance;
        return maintenance;
      }).catch(e => {
        console.log(e);
      });
  }

  goWebOnline() {
    return this.data.goWebOnline().then(maintenance => {
      this.SERVER_MAINTENANCE = maintenance;
      return maintenance;
    }).catch(e => {
      console.log(e);
    });
  }

  getItemData() {
    return this.data.getItemData().then(items => {
      this.ITEM_DATA = Optional.of(items);
      this.sortItemData();
      this.itemDataSubject.next(items);
      return items;
    });
  }

  getItemDataById(id: number) {
    if (this.ITEM_DATA.isPresent()) {
      return this.ITEM_DATA.get().find(item => item.pcxnId === id);
    } else {
      return undefined
    }
  }

  postPriceSetter(data: PriceSetter) {
    return this.data.postPriceSetter(data)
      .then(i => this.updateItemData(i)).catch(e => {
        throw e;
      });
  }

  saveItemChanges(changes: ItemChanges) {
    return this.data.saveItemData(changes)
      .then(i => this.updateItemData(i)).catch(e => {
        throw e;
      });
  }

  blockItem(id: number, block: boolean) {
    return this.data.saveItemData({pcxnId: id, blocked: block})
      .then(i => this.updateItemData(i))
      .catch(e => {
        throw e;
      });
  }

  editConnection(id: number, connection: number | null) {
    if (connection === null) {
      connection = -1;
    }
    return this.data.saveItemData({pcxnId: id, connection: connection})
      .then(i => this.updateItemData(i))
      .catch(e => {
        throw e;
      });
  }

  sortItemData() {
    if (this.ITEM_DATA.isPresent()) {
      const items = this.ITEM_DATA.get();
      this.NEW_ITEMS = Optional.of(items.filter(item => !item.setup && item.connection === null && !item.blocked));
      this.NEW_ITEM_COUNT = this.NEW_ITEMS.get().length;
      this.ITEM_CONNECTIONS = Optional.of(items.filter(item => item.connection !== null && !item.blocked));
      this.BLOCKED_ITEMS = Optional.of(items.filter(item => item.blocked));
      this.ALL_ITEMS = Optional.of(items.filter(item => item.connection === null && !item.blocked));
      this.ITEM_DATA_SEARCH = Optional.of(this.getItemDataSearches(items));
    }
  }

  getItemDataSearches(items: ItemData[]) {
    return items.map(i => {
      let result: ItemDataSearch = [i, []];
      if (i.pcxnId)
        result[1].push("id=" + i.pcxnId.toString())
      if (i.setup)
        result[1].push("setup")
      if (i.blocked)
        result[1].push("blocked")
      if (i.pcxnSearchKey)
        result[1].push(i.pcxnSearchKey.toLowerCase())
      if (i.pbvSearchKey)
        result[1].push(i.pbvSearchKey.toLowerCase())
      if (i.count && !this.hasFoundModes(i))
        i.count.forEach(c => {
          result[1].push(c.mode + "=" + c.count.toString())
          let i = c.count - 1;
          while (i > 0) {
            result[1].push(c.mode + ">" + i.toString())
            i--;
          }
        })
      if (i.modes)
        i.modes.forEach(m => {
          if (m.minPrice || m.maxPrice)
            result[1].push(m.modeKey + "!");
          if (m.retention)
            result[1].push("retention")
        })
      if (i.translation)
        i.translation.forEach(t => {
          if (t.translation)
            result[1].push(t.translation.toLowerCase())
        })
      if (i.itemUrl)
        result[1].push(i.itemUrl.toLowerCase())
      if (i.categoryIds && i.pcxnId) {
        if (i.categoryIds.length <= 0) {
          result[1].push("category=none");
        } else {
          i.categoryIds.forEach(c => {
            this.getCategoryTranslationsById(c).forEach(t => {
              result[1].push("category=" + t.translation.toLowerCase());
            });
          });
        }
      }
      return result;
    })
  }

  getItemDisplayData(data: ItemData): string {
    return this.findItemName(data) + ' - ' + data.pcxnId;
  }

  findItemName(data: ItemData | undefined): string {
    if (!data) {
      return 'Item not found';
    }
    const preferredLanguages = [Languages.German, Languages.English, Languages.MemeCxn];

    for (const language of preferredLanguages) {
      const translation = data.translation.find(t => t.language === language);
      if (translation) {
        return translation.translation;
      }
    }

    if (data.itemUrl && data.itemUrl.length > 0) {
      return data.itemUrl;
    }

    return data.pcxnSearchKey;
  }

  async getItemReportsOfItem(id: number) {
    if (this.ITEM_REPORTS.isEmpty())
      await this.getItemReports();

    return this.ITEM_REPORTS.get().filter(report => report.itemId === id);
  }

  public hasFoundModes(data: ItemData): boolean {
    const modes = this.getFoundModes(data);

    if (modes.isEmpty()) return false;

    return modes.get().length > 0;
  }

  getFoundModes(data: ItemData): Optional<string> {
    if (data.modes && data.modes.length === 0)
      return Optional.empty();

    // Filtern Sie die modes, die minPrice oder maxPrice haben
    const modesWithPrice = data.modes.filter(mode => mode.minPrice !== undefined || mode.maxPrice !== undefined);

    return Optional.of(modesWithPrice ? modesWithPrice.map(mode => mode.modeKey).join(', ') || '' : '');
  }

  getFoundModesArr(data: ItemData): Optional<string[]> {
    if (data.modes && data.modes.length === 0)
      return Optional.empty();

    // Filtern Sie die modes, die minPrice oder maxPrice haben
    const modesWithPrice = data.modes.filter(mode => mode.minPrice !== undefined || mode.maxPrice !== undefined);

    if (modesWithPrice === undefined || modesWithPrice.length === 0) return Optional.empty();

    return Optional.of(modesWithPrice.map(mode => mode.modeKey));
  }

  getCategoryTranslationsById(id: number): Translation[] {
    if (this.CATEGORY_SETTINGS.isEmpty()) return [];

    return this.CATEGORY_SETTINGS.get().find(c => c.pcxnId === id)?.translationData || [];
  }

  subscribe(func: (itemData: ItemData[]) => void) {
    return this.itemDataSubject.asObservable().subscribe(func);
  }

}
