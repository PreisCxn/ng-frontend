import {Injectable} from '@angular/core';
import {Optional} from "./optional";
import {RedirectService} from "./redirect.service";
import {Http, HttpError, HttpTestData} from "./http";
import {TranslationService} from "./translation.service";
import {Languages} from "./languages";
import {Modes} from "../mode/shared/modes";
import {Category, CategoryCreation, CategoryEntry} from "./types/categories.types";
import {
  isItemExtendedInfo, ItemChanges,
  ItemData,
  ItemExtendedInfo,
  ItemReport, ItemReportCreation,
  ItemShortInfo,
  SellBuyReq, SellBuyReqCreation
} from "./types/item.types";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ICategoryCommunication} from "./interfaces/categories.interface";
import {firstValueFrom, lastValueFrom} from "rxjs";
import {IUserCommunication} from "./interfaces/user.interface";
import {UserAuth} from "./types/user.types";
import {AuthService} from "./auth.service";
import {CookieService} from "ngx-cookie-service";
import {IServerCommunication} from "./interfaces/server.interface";
import {IModCommunication} from "./interfaces/mod.interface";
import {ModData} from "./types/mod.types";
import {IItemCommunication} from "./interfaces/item.interface";

@Injectable({
  providedIn: 'root'
})
export class DataService implements ICategoryCommunication, IUserCommunication, IServerCommunication, IModCommunication, IItemCommunication {

  private static REDIRECT: Optional<RedirectService> = Optional.empty();

  private static readonly API_URL: string = 'https://api.preiscxn.de/api';

  private static readonly TESTING: boolean = false;

  private categoryBuffer: Optional<[lang: Languages, CategoryEntry[]]> = Optional.empty();
  private itemBuffer: Optional<[mode: Modes, ItemShortInfo[]]> = Optional.empty();

  constructor(private redirect: RedirectService,
              private translationService: TranslationService,
              private client: HttpClient,
              private cookie: CookieService) {
    DataService.REDIRECT = Optional.of(redirect);
  }

  checkError(error: HttpError | Error): void {
    if (DataService.REDIRECT.isEmpty()) return;

    //@ts-ignore
    if(error?.status === 429) {
      DataService.REDIRECT.get().redirectTo429();
      return;
    }

    if (error instanceof HttpError) {
      switch (error.status) {
        case 404:
          DataService.REDIRECT.get().redirectTo404();
          break;
        case 503:
          DataService.REDIRECT.get().redirectTo503();
          break;
        case 429:
          DataService.REDIRECT.get().redirectTo429();
          break;
        default:
          DataService.REDIRECT.get().redirectTo404();
      }
    } else {
      console.log("Error: " + error.message);
      DataService.REDIRECT.get().redirectTo404();
    }
  }

  public async createCategory(category: CategoryCreation): Promise<Category> {
    return firstValueFrom<Category>(this.client.post<Category>(DataService.API_URL + "/web/categories", category, this.authHeader()));
  }

  public async deleteCategory(category: Category): Promise<boolean> {
    return firstValueFrom<boolean>(this.client.delete<boolean>(DataService.API_URL + "/web/categories/" + category.pcxnId, this.authHeader()));
  }

  public async addSellerBuyer(pcxnId: number, data: { modeKey: string, isSelling: boolean, userName: string }): Promise<ItemData> {
    return firstValueFrom(this.client.post<ItemData>(DataService.API_URL + "/web/item/sellerBuyer/"+ pcxnId, data, this.authHeader()));
  }

  public async deleteSellerBuyer(pcxnId: number, data: { modeKey: string, isSelling: boolean, userName: string }): Promise<ItemData> {
    return firstValueFrom(this.client.delete<ItemData>(DataService.API_URL + "/web/item/sellerBuyer/"+ pcxnId, this.authHeader(data)));
  }

  public async getCategoriesUsingLang(language: Languages, refresh: boolean = false): Promise<CategoryEntry[]> {
    if (!refresh && this.categoryBuffer.isPresent()) {
      if (language === this.categoryBuffer.get()[0]) {
        return new Promise<CategoryEntry[]>(
          resolve => resolve(this.categoryBuffer.get()[1])
        );
      }
    }

    if (DataService.TESTING) {
      return Http.testingGet<CategoryEntry[]>(HttpTestData.CATEGORY_ENTRIES, language)
        .then(c => this.bufferCategories(language, c));
    } else {
      return Http.get<CategoryEntry[]>(this.client, DataService.API_URL + "/web/categories/entries", {
        params: {
          language: language,
          refreshBlock: new Date().toISOString()
        }
      })
        .then(c => this.bufferCategories(language, c))
        .catch(e => {
          this.checkError(e);
          return [];
        });
    }
  }

  public async getCategoryData(): Promise<Category[]> {
    return firstValueFrom<Category[]>(this.client.get<Category[]>(DataService.API_URL + "/web/categories", this.authHeader()));
  }

  public async updateCategory(category: Partial<Category>): Promise<Category> {
    return firstValueFrom<Category>(this.client.put<Category>(DataService.API_URL + "/web/categories/" + category.pcxnId, category, this.authHeader()));
  }

  public async isAdmin(): Promise<boolean> {
    return firstValueFrom<boolean>(this.client.get<boolean>(DataService.API_URL + "/web/auth/isAdmin", this.authHeader()))
      .catch(e => {
        throw e;
      });
  }

  public async login(username: string, password: string): Promise<UserAuth> {
    return firstValueFrom(this.client.post<UserAuth>(DataService.API_URL + "/web/auth/login", {
      username: username,
      password: password
    })).catch(e => {
      throw e;
    });
  }

  public async isWebMaintenance(): Promise<boolean> {
    if (DataService.TESTING) return Promise.resolve(false);
    return firstValueFrom<boolean>(this.client.get<boolean>(DataService.API_URL + "/web/maintenance"))
      .catch(e => {
        this.checkError(e);
        throw e;
      });
  }

  public async goWebOnline(): Promise<boolean> {
    return lastValueFrom<boolean>(this.client.delete<boolean>(DataService.API_URL + "/web/maintenance", this.authHeader())).catch(e => {
      throw e
    });
  }

  public async goWebOffline(): Promise<boolean> {
    return lastValueFrom<boolean>(this.client.post<boolean>(DataService.API_URL + "/web/maintenance", {
      maintenance: false
    }, this.authHeader()));
  }

  public async getModData(): Promise<ModData> {
    return firstValueFrom<ModData>(this.client.get<ModData>(DataService.API_URL + "/web/mod/data", this.authHeader()));
  }

  public async goModOffline(): Promise<ModData> {
    return firstValueFrom<ModData>(this.client.delete<ModData>(DataService.API_URL + "/web/mod/maintenance", this.authHeader()));
  }

  public async goModOnline(): Promise<ModData> {
    return firstValueFrom<ModData>(this.client.post<ModData>(DataService.API_URL + "/web/mod/maintenance", {
      maintenance: true
    }, this.authHeader()));
  }

  public async saveModData(data: Partial<ModData>): Promise<ModData> {
    return firstValueFrom<ModData>(this.client.post<ModData>(DataService.API_URL + "/web/mod/data", data, this.authHeader()));
  }

  public async getItemData(): Promise<ItemData[]> {
    const url = `${DataService.API_URL}/web/item/data?date=${new Date().toISOString()}`;
    return lastValueFrom<ItemData[]>(this.client.get<ItemData[]>(url, this.authHeader()));
  }

  public async saveItemData(data: ItemChanges): Promise<ItemData> {
    return firstValueFrom<ItemData>(this.client.post<ItemData>(DataService.API_URL + "/web/item/data/" + data.pcxnId, data, this.authHeader()));
  }

  public async getItemReports(): Promise<ItemReport[]> {
    const url = `${DataService.API_URL}/web/item/reports?date=${new Date().toISOString()}`;
    return lastValueFrom<ItemReport[]>(this.client.get<ItemReport[]>(url, this.authHeader()));
  }

  public async createItemReport(report: ItemReportCreation): Promise<ItemReport> {
    return lastValueFrom(this.client.post<ItemReport>(DataService.API_URL + "/web/item/reports", report));
  }

  public async deleteItemReport(report: number): Promise<boolean> {
    return lastValueFrom<boolean>(this.client.delete<boolean>(DataService.API_URL + "/web/item/reports/" + report, this.authHeader()));
  }

  public async getItemShortInfo(mode: Modes): Promise<ItemShortInfo[]> {
    if (this.itemBuffer.isPresent()) {
      if (mode === this.itemBuffer.get()[0]) {
        return new Promise<ItemShortInfo[]>(
          resolve => resolve(this.itemBuffer.get()[1])
        );
      }
    }

    if (DataService.TESTING) {
      return Http.testingGet<ItemShortInfo[]>(HttpTestData.ITEM_SHORTS, mode)
        .then(i => this.bufferItemShorts(mode, i));
    } else {
      return Http.get<ItemShortInfo[]>(this.client, DataService.API_URL + "/web/item/short", {
        params: {
          mode: mode
        }
      })
        .then(i => this.bufferItemShorts(mode, i))
        .catch(e => {
          this.checkError(e);
          return [];
        });
    }
  }

  public async getItemExtendedInfo(itemId: string, mode: Modes): Promise<ItemExtendedInfo> {
    if (DataService.TESTING) {
      return Http.testingGet<ItemExtendedInfo>(HttpTestData.ITEM_EXTENDED, mode, itemId);
    } else {
      return Http.get<ItemExtendedInfo>(this.client, DataService.API_URL + "/web/item/extended", {
        params: {
          itemId: itemId,
          mode: mode
        }
      })
        .catch(e => {
          this.checkError(e);
          throw e;
        });
    }
  }

  public async getSellBuyRequests(): Promise<SellBuyReq[]> {
    return firstValueFrom<SellBuyReq[]>(this.client.get<SellBuyReq[]>(DataService.API_URL + "/web/item/sellBuyRequest", this.authHeader()));
  }

  public async createSellBuyRequest(req: SellBuyReqCreation): Promise<SellBuyReq> {
    return firstValueFrom<SellBuyReq>(this.client.post<SellBuyReq>(DataService.API_URL + "/web/item/sellBuyRequest", req));
  }

  public async declineSellBuyRequest(requestId: string): Promise<boolean> {
    return firstValueFrom<boolean>(this.client.delete<boolean>(DataService.API_URL + "/web/item/sellBuyRequest/" + requestId, this.authHeader()));
  }

  public async acceptSellBuyRequest(requestId: string): Promise<boolean> {
    return firstValueFrom<boolean>(this.client.post<boolean>(DataService.API_URL + "/web/item/sellBuyRequest/" + requestId, {}, this.authHeader()));
  }

  private authHeader(data?: any) {
    return {
      headers: {
        'Authorization': 'Bearer ' + this.cookie.get(AuthService.AUTH_COOKIE)
      },
      body: data || undefined
    };
  }

  private bufferCategories(lang: Languages, data: CategoryEntry[]): CategoryEntry[] {
    this.categoryBuffer = Optional.of([lang, data]);
    return data;
  }

  private bufferItemShorts(mode: Modes, data: ItemShortInfo[]): ItemShortInfo[] {
    this.itemBuffer = Optional.of([mode, data]);
    return data;
  }

}
