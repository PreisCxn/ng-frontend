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
}

export class Http {
  private static readonly BASE_URL: string = 'http://127.0.0.1:8000/api';

  public static readonly isTESTING: boolean = true;

 public static async GET<T, R>(uri: string, params?: {[key: string]: string}, stringTFunction?: (s: string) => T, callback?: (t: T) => R | T, ...headers: string[]): Promise<R | T> {

  if(!stringTFunction) {
    stringTFunction = JSON.parse;
  }

  if(!callback) {
    callback = (s: T) => s;
  }

  let url = this.BASE_URL + uri;

  // Convert params object to query string
  if (params) {
    const queryParams = Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    url += `?${queryParams}`;
  }

  const options = {
    method: 'GET',
    headers: this.buildHeaders(headers)
  };

  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new HttpError("Failed to read data response...", response.status);
      }
      return response.text();
    })
    .then(body => stringTFunction!(body))
    .then(result => callback!(result))
    .catch(error => {
      throw error;
    });
}

  public static async PUT<T, R>(uri: string, json: any, stringTFunction: (s: string) => T, callback: (t: T) => R, ...headers: string[]): Promise<R> {
    const url = this.BASE_URL + uri;
    const options = {
      method: 'PUT',
      headers: this.buildHeaders(headers, 'application/json'),
      body: JSON.stringify(json)
    };

    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new HttpError("Failed to update data response...", response.status);
        }
        return response.text();
      })
      .then(body => stringTFunction(body))
      .then(result => callback(result))
      .catch(error => {
        throw error;
      });
  }

  public static async POST<T, R>(uri: string, json: any, stringTFunction: (s: string) => T, callback: (t: T) => R, ...headers: string[]): Promise<R> {
    const url = this.BASE_URL + uri;
    const options = {
      method: 'POST',
      headers: this.buildHeaders(headers, 'application/json'),
      body: JSON.stringify(json)
    };

    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new HttpError("Failed to create data response...", response.status);
        }
        return response.text();
      })
      .then(body => stringTFunction(body))
      .then(result => callback(result))
      .catch(error => {
        throw error;
      });
  }

  private static buildHeaders(headers: string[], contentType?: string): Headers {
    const headersObj = new Headers();
    for (let i = 0; i < headers.length; i += 2) {
      headersObj.append(headers[i], headers[i + 1]);
    }
    if (contentType) {
      headersObj.append('Content-Type', contentType);
    }
    return headersObj;
  }

  public static async testPromise<T>(data: T | {[key:string]: T}, ...params: string[]): Promise<T> {
    return new Promise((resolve, reject) => {
      console.log("executing testPromise " + params);

      setTimeout(() => {
        if(params.length > 0)
          {
            const result = params.reduce((obj:any, key:string) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, data);
            resolve(result);
          }
        else
          resolve(data as T);
      }, 100);
    });
  }

  public static async testingGet<T>(url: HttpTestData, ...params: string[]): Promise<T> {
   const result = await fetch(url);
    const testData: T | {[key:string]: T} = await result.json();

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
