import {Inject, Injectable, OnInit, PLATFORM_ID} from '@angular/core';
import {Languages} from "./languages";
import {filter, from, Observable, startWith, Subject} from 'rxjs';
import { tap } from 'rxjs/operators';
import {CookieService} from "ngx-cookie-service";
import {Optional} from "./optional";
import {isPlatformBrowser} from "@angular/common";
import {NavigationStart, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private language: Optional<Languages> = Optional.of(this.getLanguageFromLocalStorage() === null ? Languages.English : this.getLanguageFromLocalStorage());
  private languageData: { [key: string]: string } = {};
  private languageChange: Subject<Languages> = new Subject<Languages>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.setLanguage(this.language.orElse(Languages.English));
  }

  triggerRecalculation() {
    if(this.language.isPresent())
      this.setLanguage(this.language.get());
  }

  public setLanguage(language: Languages) {
    this.language = Optional.of(language);
    this.saveLanguageToLocalStorage();
    console.log(language)
    this.loadLanguageData().subscribe();
  }

  private loadLanguageData() {
    return from(import("../../assets/lang/web/" + this.language.get() + ".json"))
      .pipe(tap(data => {
        this.languageData = data.default;
        this.languageChange.next(this.language.get());
      }));
  }

  public getCurrentLanguage(): Languages {
    return this.language.get();
  }

  public getTranslation(key: string): string {
    return this.languageData[key];
  }

  public getTranslationAsArray(key: string): string[] {
    return this.languageData[key].split("\n");
  }

  public getLanguageData(): { [key: string]: string } {
    return this.languageData;
  }

  public subscribe(callback: (language: Languages) => void) {
    return this.languageChange.subscribe(callback);
  }

  public pipe(fn: (source: Observable<Languages>) => Observable<any>): Observable<any> {
    return fn(this.languageChange);
  }

  public getLanguageChange(): Observable<Languages> {
    return this.languageChange;
  }

  private saveLanguageToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', this.language.get());
    }
  }

  private getLanguageFromLocalStorage(): Languages {
    if (isPlatformBrowser(this.platformId)) {
      const localStorageValue = localStorage.getItem('language');
      console.log(localStorageValue)
      return localStorageValue as Languages;
    } else {
      return Languages.English;
    }
  }
}
