import {HttpClient, HttpContext, HttpHeaders, HttpParams} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
import {CategoryEntry} from "./types/categories.types";

export class HttpError extends Error {
  public status: number;

  constructor(error: string, status: number) {
    super(error);
    this.name = 'HttpError';
    this.status = status;
  }

}

export enum HttpTestData {
  CATEGORY_ENTRIES = '../../assets/testHttp/CategoryEntries.json',
  ITEM_SHORTS = '../../assets/testHttp/ItemShorts.json',
  ITEM_EXTENDED = '../../assets/testHttp/ItemExtended.json',
}

export class Http {
  private static readonly BASE_URL: string = 'http://127.0.0.1:8000/api';

  public static readonly isTESTING: boolean = true;

  private static async testPromise<T>(data: T | { [key: string]: T }, ...params: string[]): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (params.length > 0)
          resolve(params.reduce((obj: any, key: string) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, data));
        else
          resolve(data as T);
      }, 100);
    });
  }

  public static async testingGet<T>(url: HttpTestData, ...params: string[]): Promise<T> {
    const result = await fetch(url);
    const testData: T | { [key: string]: T } = await result.json();

    return Http.testPromise<T>(testData, ...params);
  }

  public static async get<T>(http: HttpClient, url: string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    transferCache?: {
      includeHeaders?: string[];
    } | boolean;
  }): Promise<T> {
    return firstValueFrom<T>(http.get<T>(url, options));
  };

}
