import {Injectable} from '@angular/core';
import {ModeService} from "../../mode/shared/mode.service";
import {Languages} from "../../shared/languages";
import {ModData} from "../../shared/types/mod.types";
import {Optional} from "../../shared/optional";
import {DataService} from "../../shared/data.service";
import {Category, CategoryCreation} from "../../shared/types/categories.types";
import {SellBuyReq} from "../../shared/types/item.types";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public MOD_SETTINGS: Optional<ModData> = Optional.empty();

  public CATEGORY_SETTINGS: Optional<Category[]> = Optional.empty();

  public SELL_BUY_REQUESTS: Optional<SellBuyReq[]> = Optional.empty();

  public NOTIFICATIONS: number = 0;

  public SELL_BUY_REQUESTS_COUNT: number = 0;

  constructor(private mode: ModeService, private data: DataService) {
    this.getSellBuyRequests().then(requests => {
      this.SELL_BUY_REQUESTS_COUNT = requests.length;
    });
  }

  getCategories(language: Languages) {
    return this.mode.getCategories(language);
  }

  getSellBuyRequests() {
    return this.data.getSellBuyRequests().then(requests => {
      console.log(requests)
      this.SELL_BUY_REQUESTS = Optional.of(requests);
      this.SELL_BUY_REQUESTS_COUNT = requests.length;
      return requests;
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

}
