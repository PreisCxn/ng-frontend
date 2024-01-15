import {Injectable} from '@angular/core';
import {catchError, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {Optional} from "./optional";
import {CategoryEntry, TranslationType} from "./pcxn.types";
import {RedirectService} from "./redirect.service";
import {Http, HttpError} from "./http";
import {TranslationService} from "./translation.service";
import {Languages} from "./languages";

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
