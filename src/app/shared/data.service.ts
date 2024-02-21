import {Injectable} from '@angular/core';
import {Optional} from "./optional";
import {RedirectService} from "./redirect.service";
import {Http, HttpError, HttpTestData} from "./http";
import {TranslationService} from "./translation.service";
import {Languages} from "./languages";
import {Modes} from "../mode/shared/modes";
import {Category, CategoryCreation, CategoryEntry} from "./types/categories.types";
import {isItemExtendedInfo, ItemExtendedInfo, ItemShortInfo} from "./types/item.types";
import {HttpClient} from "@angular/common/http";
import {ICategoryCommunication} from "./interfaces/categories.interface";
import {firstValueFrom} from "rxjs";
import {IUserCommunication} from "./interfaces/user.interface";
import {UserAuth} from "./types/user.types";
import {AuthService} from "./auth.service";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class DataService implements ICategoryCommunication, IUserCommunication {

  private static REDIRECT: Optional<RedirectService> = Optional.empty();

  private static readonly API_URL: string = 'http://localhost:8080/api';

  private static readonly TESTING: boolean = true;

  private categoryBuffer: Optional<[lang: Languages, CategoryEntry[]]> = Optional.empty();

  constructor(private redirect: RedirectService,
              private translationService: TranslationService,
              private client: HttpClient,
              private cookie: CookieService) {
    DataService.REDIRECT = Optional.of(redirect);
  }

  async getItemExtended(itemId: string, mode: Modes, lang: Languages, test: boolean = false): Promise<ItemExtendedInfo> {
    if (test) {
      return Http.testPromise({
        skyblock: {
          iron_pickaxe: {
            modeKey: mode,
            itemUrl: '/iron_pickaxe',
            imageUrl: 'assets/img/items/mc/items/iron_pickaxe.png',
            translation: [
              {
                language: 'en',
                translation: 'Iron Pickaxe',
              },
              {
                language: 'de',
                translation: 'Eisen Spitzhacke',
              },
              {
                language: 'mxn',
                translation: 'Vereisener Steinklopfer'
              }
            ],
            minPrice: 100,
            maxPrice: 1000,
            categoryIds: [3],
            animationData: [{
              type: 'pcxn.item-anim.crafting',
              data: [
                [0, 'assets/img/items/mc/items/iron_ingot.png'],
                [1, 'assets/img/items/mc/items/iron_ingot.png'],
                [2, 'assets/img/items/mc/items/iron_ingot.png'],
                [4, 'assets/img/items/mc/items/stick.png'],
                [7, 'assets/img/items/mc/items/stick.png'],
              ]
            },
              {
                type: 'test'
              }],
            sellingUser: [],
            buyingUser: [],
            description: {
              information: [
                {
                  language: 'en',
                  translation: 'Englisch Beschreibung',
                },
                {
                  language: 'de',
                  translation: 'Deutsche Beschreibung',
                },
                {
                  language: 'mxn',
                  translation: 'mxn Beschreibung'
                }
              ],
            },
            diagramData: {
              labels: ["1", "2", "3", "4", "5"],
              data: [1, 2, 3, 4, 5]
            },
            lastUpdate: 1234567890,
            nookPrice: 100
          },
          diamond_sword: {
            modeKey: mode,
            itemUrl: '/diamond_sword',
            imageUrl: 'assets/img/items/mc/items/diamond_sword.png',
            translation: [
              {
                language: 'en',
                translation: 'Diamond Sword',
              },
              {
                language: 'de',
                translation: 'Diamant Schwert',
              },
            ],
            minPrice: 100,
            maxPrice: 1000,
            categoryIds: [3, 5],
            animationData: [{
              type: 'pcxn.item-anim.crafting',
              data: [
                [1, 'assets/img/items/mc/items/diamond.png'],
                [4, 'assets/img/items/mc/items/diamond.png'],
                [7, 'assets/img/items/mc/items/stick.png'],
              ]
            },
              {
                type: 'pcxn.item-anim.crafting',
                data: [
                  [3, 'assets/img/items/mc/items/diamond_sword.png'],
                  [4, 'assets/img/items/mc/items/diamond_sword.png']
                ]
              }],
            sellingUser: [{
              name: '_Alive_',
              userId: 1,
            }],
            buyingUser: [{
              name: '_Niklaaas_',
              userId: 1,
            }],
            description: {
              information: [
                {
                  language: 'en',
                  translation: 'Englisch Beschreibung',
                },
                {
                  language: 'de',
                  translation: 'Deutsche Beschreibung',
                },
                {
                  language: 'mxn',
                  translation: 'mxn Beschreibung'
                }
              ],
            },
            diagramData: {
              labels: ["1", "2", "3", "4", "5"],
              data: [1, 2, 3, 4, 5]
            },
            lastUpdate: 1234567890
          }
        }
      }, mode, itemId).then((data => {
        return DataService.convertJSONToItemExtendedInfo(data);
      }));
    }
    return await Http.GET<any, CategoryEntry[]>(
      "/itemextended",
      {
        mode: mode,
        itemId: itemId
      },
      JSON.parse,
      DataService.convertJSONToItemExtendedInfo
    )
      .then((item: ItemExtendedInfo) => {
        return item;
      })
      .catch(e => {
        this.checkError(e);
        throw new Error("Failed to get categories");
      });
  }

  /*
{
      modeKey: mode,
      itemUrl: '/iron_pickaxe',
      imageUrl: 'assets/img/items/mc/items/iron_pickaxe.png',
      translation: [
        {
          language: 'en',
          translation: 'Iron Pickaxe',
        },
        {
          language: 'de',
          translation: 'Eisen Spitzhacke',
        },
        {
          language: 'mxn',
          translation: 'Vereisener Steinklopfer'
        }
      ],
      minPrice: 100,
      maxPrice: 1000,
      categoryIds: [3],
      animationData: [{
        type: 'pcxn.item-anim.crafting',
        data: [
          [0, 'assets/img/items/mc/items/iron_ingot.png'],
          [1, 'assets/img/items/mc/items/iron_ingot.png'],
          [2, 'assets/img/items/mc/items/iron_ingot.png'],
          [4, 'assets/img/items/mc/items/stick.png'],
          [7, 'assets/img/items/mc/items/stick.png'],
        ]
      },
        {
          type: 'test'
        }],
      sellingUser: [],
      buyingUser: [],
      description: {
        information: "pcxn.item.iron_pickaxe.description"
      },
      diagramData: {
        labels: ["1", "2", "3", "4", "5"],
        data: [1, 2, 3, 4, 5]
      },
      lastUpdate: 1234567890,
      nookPrice: 100
    });
  });
}
   */

  async getItemShorts(test: boolean = false, mode: Modes): Promise<ItemShortInfo[]> {
    return await this.requestItemShorts(mode, test);
  }

  private static convertJSONToItemShortInfo(json: any): ItemShortInfo[] {
    try {
      return (json as any[]).map(item => {
        if (!item.itemUrl || !item.imageUrl || !item.translation || !item.minPrice
          || !item.maxPrice || !item.categoryIds) {
          throw new Error('Invalid item structure');
        }
        return {
          modeKey: item.modeKey,
          itemUrl: item.itemUrl,

          imageUrl: item.imageUrl,
          translation: item.translation,
          minPrice: item.minPrice,
          maxPrice: item.maxPrice,
          categoryIds: item.categoryIds,

          animationData: item.animationData,
          sellingUser: item.sellingUser,
          buyingUser: item.buyingUser,
        } as ItemShortInfo;
      }) as ItemShortInfo[];
    } catch (error) {
      throw new Error('Failed to map JSON to ItemShortInfo[]');
    }
  }

  private static convertJSONToItemExtendedInfo(json: any): ItemExtendedInfo {
    try {
      if (isItemExtendedInfo(json) === false)
        throw new Error('Invalid item structure');
      return {
        modeKey: json.modeKey,
        itemUrl: json.itemUrl,

        imageUrl: json.imageUrl,
        translation: json.translation,
        minPrice: json.minPrice,
        maxPrice: json.maxPrice,
        categoryIds: json.categoryIds,

        animationData: json.animationData,
        sellingUser: json.sellingUser,
        buyingUser: json.buyingUser,

        description: json.description,
        diagramData: json.diagramData,
        lastUpdate: json.lastUpdate,
        nookPrice: json.nookPrice
      } as ItemExtendedInfo;
    } catch (error: Error | any) {
      throw new Error('Failed to map JSON to ItemExtendedInfo: ' + error.message);
    }
  }

  private checkError(error: HttpError | Error): void {
    if (DataService.REDIRECT.isEmpty()) return;

    if (error instanceof HttpError) {
      switch (error.status) {
        case 404:
          DataService.REDIRECT.get().redirectTo404();
          break;
        case 503:
          DataService.REDIRECT.get().redirectTo503();
          break;
        default:
          DataService.REDIRECT.get().redirectTo404();
      }
    } else {
      DataService.REDIRECT.get().redirectTo404();
    }
  }

  private async requestItemShorts(mode: Modes, test: boolean = false): Promise<ItemShortInfo[]> {
    console.log("req ItemShorts")
    if (test) {
      return Http.testPromise({
        "skyblock": [
          {
            modeKey: mode,
            itemUrl: '/iron_pickaxe',
            imageUrl: 'assets/img/items/mc/items/iron_pickaxe.png',
            translation: [
              {
                language: 'en',
                translation: 'Iron Pickaxe',
              },
              {
                language: 'de',
                translation: 'Eisen Spitzhacke',
              },
              {
                language: 'mxn',
                translation: 'Vereisener Steinklopfer'
              }
            ],
            minPrice: 100,
            maxPrice: 1000,
            categoryIds: [3],
            animationData: [{
              type: 'pcxn.item-anim.crafting',
              data: [
                [0, 'assets/img/items/mc/items/iron_ingot.png'],
                [1, 'assets/img/items/mc/items/iron_ingot.png'],
                [2, 'assets/img/items/mc/items/iron_ingot.png'],
                [4, 'assets/img/items/mc/items/stick.png'],
                [7, 'assets/img/items/mc/items/stick.png'],
              ]
            },
              {
                type: 'test'
              }],
            sellingUser: [],
            buyingUser: [],
          },
          {
            modeKey: mode,
            itemUrl: '/diamond_sword',
            imageUrl: 'assets/img/items/mc/items/diamond_sword.png',
            translation: [
              {
                language: 'en',
                translation: 'Diamond Sword',
              },
              {
                language: 'de',
                translation: 'Diamant Schwert',
              },
            ],
            minPrice: 100,
            maxPrice: 1000,
            categoryIds: [3, 5],
            animationData: [{
              type: 'pcxn.item-anim.crafting',
              data: [
                [1, 'assets/img/items/mc/items/diamond.png'],
                [4, 'assets/img/items/mc/items/diamond.png'],
                [7, 'assets/img/items/mc/items/stick.png'],
              ]
            },
              {
                type: 'pcxn.item-anim.crafting',
                data: [
                  [3, 'assets/img/items/mc/items/diamond_sword.png'],
                  [4, 'assets/img/items/mc/items/diamond_sword.png']
                ]
              }],
            sellingUser: [{
              name: '_Alive_',
              userId: 1,
            }],
            buyingUser: [{
              name: '_Niklaaas_',
              userId: 1,
            }],
          },
          {
            modeKey: mode,
            itemUrl: '/diamond_boots',
            imageUrl: 'assets/img/items/mc/items/diamond_boots.png',
            translation: [
              {
                language: 'en',
                translation: 'Diamond Boots',
              },
              {
                language: 'de',
                translation: 'Diamant Stiefel',
              },
            ],
            minPrice: 100,
            maxPrice: 1000,
            categoryIds: [5],
            animationData: [{
              type: 'pcxn.item-anim.crafting',
              data: [
                [3, 'assets/img/items/mc/items/diamond.png'],
                [5, 'assets/img/items/mc/items/diamond.png'],
                [6, 'assets/img/items/mc/items/diamond.png'],
                [8, 'assets/img/items/mc/items/diamond.png'],
              ]
            }],
            sellingUser: [],
            buyingUser: [],
          },
          {
            modeKey: mode,
            itemUrl: '/diamond_chestplate',
            imageUrl: 'assets/img/items/mc/items/diamond_chestplate.png',
            translation: [
              {
                language: 'en',
                translation: 'Diamond Chestplate',
              },
              {
                language: 'de',
                translation: 'Diamant Brustplatte',
              },
            ],
            minPrice: 100,
            maxPrice: 1000,
            categoryIds: [5],
            animationData: [{
              type: 'pcxn.item-anim.crafting',
              data: [
                [0, 'assets/img/items/mc/items/diamond.png'],
                [2, 'assets/img/items/mc/items/diamond.png'],
                [3, 'assets/img/items/mc/items/diamond.png'],
                [4, 'assets/img/items/mc/items/diamond.png'],
                [5, 'assets/img/items/mc/items/diamond.png'],
                [6, 'assets/img/items/mc/items/diamond.png'],
                [7, 'assets/img/items/mc/items/diamond.png'],
                [8, 'assets/img/items/mc/items/diamond.png'],
              ]
            }],
            sellingUser: [],
            buyingUser: [],
          },
          {
            modeKey: mode,
            itemUrl: '/glowstone',
            imageUrl: 'assets/img/items/mc/block/glowstone.png',
            translation: [
              {
                language: 'en',
                translation: 'Glowstone',
              },
              {
                language: 'de',
                translation: 'Leuchtstein',
              },
            ],
            minPrice: 100,
            maxPrice: 1000,
            categoryIds: [],
            animationData: [{
              type: 'pcxn.item-anim.crafting',
              data: [
                [3, 'assets/img/items/mc/items/glowstone_dust.png'],
                [4, 'assets/img/items/mc/items/glowstone_dust.png'],
                [6, 'assets/img/items/mc/items/glowstone_dust.png'],
                [7, 'assets/img/items/mc/items/glowstone_dust.png'],
              ]
            }],
            sellingUser: [],
            buyingUser: [],
          },
          {
            modeKey: mode,
            itemUrl: '/iron_ingot',
            imageUrl: 'assets/img/items/mc/items/iron_ingot.png',
            translation: [
              {
                language: 'en',
                translation: 'Iron Ingot',
              },
              {
                language: 'de',
                translation: 'Eisen Barren',
              },
            ],
            minPrice: 100,
            maxPrice: 1000,
            categoryIds: [],
            animationData: [{
              type: 'pcxn.item-anim.crafting',
              data: [
                [0, 'assets/img/items/mc/items/iron_nugget.png'],
                [1, 'assets/img/items/mc/items/iron_nugget.png'],
                [2, 'assets/img/items/mc/items/iron_nugget.png'],
                [3, 'assets/img/items/mc/items/iron_nugget.png'],
                [4, 'assets/img/items/mc/items/iron_nugget.png'],
                [5, 'assets/img/items/mc/items/iron_nugget.png'],
                [6, 'assets/img/items/mc/items/iron_nugget.png'],
                [7, 'assets/img/items/mc/items/iron_nugget.png'],
                [8, 'assets/img/items/mc/items/iron_nugget.png'],
              ]
            }, {
              type: 'pcxn.item-anim.crafting',
              data: [
                [4, 'assets/img/items/mc/block/iron_block.png']
              ]
            }],
            sellingUser: [],
            buyingUser: [],
          }
        ],
        "citybuild": [
          {
            modeKey: mode,
            itemUrl: '/',
            imageUrl: 'assets/img/items/mc/items/diamond_sword.png',
            translation: [
              {
                language: 'en',
                translation: 'Citybuild Stine',
              },
              {
                language: 'de',
                translation: 'Citybuild Stine',
              },
              {
                language: 'mxn',
                translation: 'OLLE'
              }
            ],
            minPrice: 100.65,
            maxPrice: 1000.4,
            categoryIds: [],
            animationUrl: '/',
            sellingUser: [],
            buyingUser: [],
          },
          {
            modeKey: mode,
            itemUrl: '/',
            imageUrl: '/',
            translation: [
              {
                language: 'en',
                translation: 'Wood',
              },
              {
                language: 'de',
                translation: 'Holz',
              },
            ],
            minPrice: 10200,
            maxPrice: 10600,
            categoryIds: [],
            animationUrl: '/',
            sellingUser: [],
            buyingUser: [],
          },
          {
            modeKey: mode,
            itemUrl: '/',
            imageUrl: '/',
            translation: [
              {
                language: 'en',
                translation: 'Cobblestone',
              },
              {
                language: 'de',
                translation: 'Bruchstein',
              },
            ],
            minPrice: 1000000,
            maxPrice: 1800000,
            categoryIds: [],
            animationUrl: '/',
            sellingUser: [],
            buyingUser: [],
          },
          {
            modeKey: mode,
            itemUrl: '/',
            imageUrl: '/',
            translation: [
              {
                language: 'en',
                translation: 'Englisch',
              },
              {
                language: 'de',
                translation: 'Deutsch',
              },
            ],
            minPrice: 100000000,
            maxPrice: 100500000,
            categoryIds: [],
            animationUrl: '/',
            sellingUser: [],
            buyingUser: [],
          },
          {
            modeKey: mode,
            itemUrl: '/',
            imageUrl: '/',
            translation: [
              {
                language: 'en',
                translation: 'Glowstone',
              },
              {
                language: 'de',
                translation: 'Leuchtstein',
              },
            ],
            minPrice: 100,
            maxPrice: 1000,
            categoryIds: [],
            animationUrl: '/',
            sellingUser: [],
            buyingUser: [],
          }
        ]
      }, mode).then((data => {

        return DataService.convertJSONToItemShortInfo(data);
      }));
    } else
      return new Promise((resolve, reject) => {
        resolve([]);
      });
  }

  async checkMaintenance() {
    return false;
    return Http.GET(
      "/ping",
      undefined,
      undefined
    ).catch(this.checkError);
  }

  public async createCategory(category: CategoryCreation): Promise<Category> {
    return firstValueFrom<Category>(this.client.post<Category>(DataService.API_URL + "/web/categories", category, this.authHeader()));
  }

  public async deleteCategory(category: Category): Promise<boolean> {
    return firstValueFrom<boolean>(this.client.delete<boolean>(DataService.API_URL + "/web/categories/" + category.pcxnId, this.authHeader()));
  }

  public async getCategoriesUsingLang(language: Languages): Promise<CategoryEntry[]> {
    if (this.categoryBuffer.isPresent()) {
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
      return Http.get<CategoryEntry[]>(this.client, DataService.API_URL + "/web/categories", {
        params: {
          lang: language
        }
      })
        .then(c => this.bufferCategories(language, c));
    }
  }

  public async getCategoryData(): Promise<Category[]> {
    return firstValueFrom<Category[]>(this.client.get<Category[]>(DataService.API_URL + "/web/categories", this.authHeader()));
  }

  public async updateCategory(category: Category): Promise<Category> {
    return firstValueFrom<Category>(this.client.put<Category>(DataService.API_URL + "/web/categories/" + category.pcxnId, category, this.authHeader()));
  }

  private bufferCategories(lang: Languages, data: CategoryEntry[]): CategoryEntry[] {
    this.categoryBuffer = Optional.of([lang, data]);
    return data;
  }

  public async isAdmin(): Promise<boolean> {
    return firstValueFrom<boolean>(this.client.get<boolean>(DataService.API_URL + "/web/isAdmin", this.authHeader()));
  }

  public async login(username: string, password: string): Promise<UserAuth> {
    return firstValueFrom(this.client.post<UserAuth>(DataService.API_URL + "/web/login", {
      username: username,
      password: password
    }));
  }

  private authHeader() {
    return {
      headers: {
        'Authorization': 'Bearer ' + this.cookie.get(AuthService.AUTH_COOKIE)
      }
    };
  }

}
