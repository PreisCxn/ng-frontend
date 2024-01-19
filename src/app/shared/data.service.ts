import {Injectable} from '@angular/core';
import {catchError, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {Optional} from "./optional";
import {CategoryEntry, ItemShortInfo, Translation, TranslationType} from "./pcxn.types";
import {RedirectService} from "./redirect.service";
import {Http, HttpError} from "./http";
import {TranslationService} from "./translation.service";
import {Languages} from "./languages";
import {Modes} from "../mode/shared/modes";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private static REDIRECT: Optional<RedirectService> = Optional.empty();

  private static readonly API_URL: string = 'http://localhost:8080/api';

  private category_buffer: Optional<
    [
      Languages,
      CategoryEntry[]
    ]
  > = Optional.empty();

  private item_short_buffer: Optional<{ mode: Modes, data: ItemShortInfo[] }[]>
    = Optional.empty();

  constructor(private redirect: RedirectService, private translationService: TranslationService) {
    DataService.REDIRECT = Optional.of(redirect);
  }

  async getCategories(test: boolean = false, lang: Languages): Promise<CategoryEntry[]> {
    if (this.category_buffer.isPresent() && this.category_buffer.get()[0] === lang) {
      return this.category_buffer.get()[1];
    } else {
      if (test) {
        // @ts-ignore
        return Http.testPromise({
          de: [
            {
              pcxnId: 2,
              route: "test",
              translationData: {
                translation: "Test"
              }

            },
            {
              pcxnId: 3,
              route: "test2",
              translationData: {
                translation: "Test2"
              },
              inNav: true
            },
            {
              pcxnId: 4,
              route: "test3",
              translationData: {
                translation: "Test3"
              },
              inNav: true
            },
            {
              pcxnId: 5,
              route: "test4",
              translationData: {
                translation: "Test4"
              },
              inNav: true
            },
            {
              pcxnId: 6,
              route: "test5",
              translationData: {
                translation: "Test5"
              },
              inNav: true
            },
            {
              pcxnId: 7,
              route: "test6",
              translationData: {
                translation: "Test6"
              },
              inNav: true
            },
            {
              pcxnId: 8,
              route: "test7",
              translationData: {
                translation: "Test7"
              },
              inNav: true
            },
            {
              pcxnId: 9,
              route: "test8",
              translationData: {
                translation: "Test8"
              },
              inNav: true
            },
            {
              pcxnId: 10,
              route: "test9",
              translationData: {
                translation: "Test9"
              },
              inNav: true
            },
            {
              pcxnId: 11,
              route: "test10",
              translationData: {
                translation: "Test10"
              },
              inNav: true
            },
            {
              pcxnId: 12,
              route: "test11",
              translationData: {
                translation: "Test11"
              },
              inNav: true
            },
            {
              pcxnId: 13,
              route: "blocks",
              translationData: {
                translation: "Blöcke"
              },
              inNav: true
            }
          ],
          en: [
            {
              pcxnId: 13,
              route: "blocks",
              translationData: {
                translation: "Blocks"
              },
              inNav: true
            }
          ]
        }, lang).then((data => {
          //@ts-ignore
          this.category_buffer = Optional.of([lang, data]);
          return data;
        }));
      }
      await Http.GET<any, CategoryEntry[]>(
        "/categories",
        {
          lang: this.translationService.getCurrentLanguage()
        },
        JSON.parse,
        DataService.convertJSONToCategoryEntries
      )
        .then((categories: CategoryEntry[]) => {
          this.category_buffer = Optional.of([lang, categories]);
        })
        .catch(e => {
          this.checkError(e);
          throw new Error("Failed to get categories");
        });

      return this.category_buffer.get()[1];
    }
  }

  async getItemShorts(test: boolean = false, mode: Modes): Promise<ItemShortInfo[]> {
    if (this.item_short_buffer.isPresent()) {

      const buffer = this.item_short_buffer
        .get()
        .filter(i => i.mode === mode)[0];

      if(buffer)
        return buffer['data'];
    }

    return await this.requestItemShorts(mode, test);
  }

  private static convertJSONToCategoryEntries(json: any): CategoryEntry[] {
    try {
      return (json as any[]).map(item => {
        if (!item.id || !item.route || !item.translationData || !item.translationData.translation) {
          throw new Error('Invalid item structure');
        }
        return {
          pcxnId: item.id,
          route: item.route,
          translationData: {
            translation: item.translationData.translation
          },
          inNav: item.inNav ? item.inNav : false
        } as CategoryEntry;
      }) as CategoryEntry[];
    } catch (error) {
      console.error(error);
      throw new Error('Failed to map JSON to CategoryEntry[]');
    }
  }

  private static convertJSONToItemShortInfo(json: any): ItemShortInfo[] {
    try {
      return (json as any[]).map(item => {
        if (!item.itemUrl || !item.imageUrl || !item.translation || !item.minPrice
        || !item.maxPrice || !item.categoryIds) {
          console.log(item.itemUrl)
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

          animationUrl: item.animationUrl,
          sellingUser:  item.sellingUser,
          buyingUser: item.buyingUser,
        } as ItemShortInfo;
      }) as ItemShortInfo[];
    } catch (error) {
      console.error(error);
      throw new Error('Failed to map JSON to ItemShortInfo[]');
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

  private async requestItemShorts(mode: Modes, test:boolean = false): Promise<ItemShortInfo[]> {
    if (test) {
      return Http.testPromise({
        "skyblock": [
        {
          modeKey: mode,
          itemUrl: '/',
          imageUrl: '/',
          translation: [
            {
              language: 'en',
              translation: 'Stine',
            },
            {
              language: 'de',
              translation: 'Stein',
            },
            {
              language: 'mxn',
              translation: 'OLLE'
            }
          ],
          minPrice: 100,
          maxPrice: 1000,
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
          minPrice: 100,
          maxPrice: 1000,
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
          minPrice: 100,
          maxPrice: 1000,
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
          minPrice: 100,
          maxPrice: 1000,
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
      ],
        "citybuild": [
          {
            modeKey: mode,
            itemUrl: '/',
            imageUrl: '/',
            translation: [
              {
                language: 'en',
                translation: 'Citybuild Stine',
              },
              {
                language: 'de',
                translation: 'Stein',
              },
              {
                language: 'mxn',
                translation: 'OLLE'
              }
            ],
            minPrice: 100,
            maxPrice: 1000,
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
            minPrice: 100,
            maxPrice: 1000,
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
            minPrice: 100,
            maxPrice: 1000,
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
            minPrice: 100,
            maxPrice: 1000,
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
        if(this.item_short_buffer.isEmpty()) this.item_short_buffer = Optional.of([]);


        console.log(data)
        const shortInfo: ItemShortInfo[]  = DataService.convertJSONToItemShortInfo(data);

        this.item_short_buffer.get().push({mode: mode, data: shortInfo});
        return shortInfo;
      }));
    }
    await Http.GET<any, ItemShortInfo[]>(
      "/items",
      {
        mode: mode
      },
      JSON.parse,
      DataService.convertJSONToItemShortInfo
    )
      .then((data: CategoryEntry[]) => {
        if(this.item_short_buffer.isEmpty()) this.item_short_buffer = Optional.of([]);

        const shortInfo: ItemShortInfo[]  = DataService.convertJSONToItemShortInfo(data);

        this.item_short_buffer.get().push({mode: mode, data: shortInfo});
      })
      .catch(e => {
        this.checkError(e);
        throw new Error("Failed to get itemShorts");
      });

    return this.item_short_buffer.get().filter(i => i.mode === mode)[0]['data'];
  }

  async checkMaintenance() {
    return false;
    return Http.GET(
      "/ping",
      undefined,
      undefined
    ).catch(this.checkError);
  }


  async testPromise(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(data);
      }, 100);
    });
  }

}
