import {Injectable} from '@angular/core';
import {catchError, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {Optional} from "./optional";
import {CategoryEntry, TranslationType} from "./pcxn.types";
import {RedirectService} from "./redirect.service";
import {Http, HttpError} from "./http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private static REDIRECT: Optional<RedirectService> = Optional.empty();

  private static readonly API_URL: string = 'http://localhost:8080/api';

  private category_buffer: Optional<CategoryEntry[]> = Optional.empty();

  constructor(private redirect: RedirectService) {
    DataService.REDIRECT = Optional.of(redirect);
  }

  async getCategories(): Promise<CategoryEntry[]> {
    if (this.category_buffer.isPresent()) {
      return this.category_buffer.get();
    } else {

      await Http.GET<any, CategoryEntry[]>(
        "/categories",
        JSON.parse,
        DataService.convertJSONToCategoryEntries
      )
        .then((categories: CategoryEntry[]) => {
          this.category_buffer = Optional.of(categories);
        })
        .catch(
          this.checkError
        );

      return this.category_buffer.orElse([]);
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
    if(DataService.REDIRECT.isEmpty()) return;

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
