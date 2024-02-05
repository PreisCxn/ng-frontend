import {Inject, Injectable, OnInit, PLATFORM_ID} from '@angular/core';
import {Languages} from "./languages";
import {filter, from, Observable, startWith, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {CookieService} from "ngx-cookie-service";
import {Optional} from "./optional";
import {isPlatformBrowser} from "@angular/common";
import {NavigationStart, Router} from "@angular/router";
import {Translation} from "./pcxn.types";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private static readonly BACKUP_LANGUAGE: Languages = Languages.German;

  public static isLanguageKey(key: string): boolean {
    return Object.values(Languages).includes(key as Languages);
  }

  public static isTranslationKey(key: string | undefined): boolean {
    if (!key) return false;

    return key.startsWith("pcxn.");
  }

  private language: Optional<Languages> = Optional.of(this.getLanguageFromLocalStorage() === null ? Languages.English : this.getLanguageFromLocalStorage());
  private languageData: { [key: string]: string } = {};
  private languageChange: Subject<Languages> = new Subject<Languages>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.setLanguage(this.language.orElse(Languages.English));
  }

  triggerRecalculation() {
    if (this.language.isPresent())
      this.setLanguage(this.language.get());
  }

  public setLanguage(language: Languages) {
    this.language = Optional.of(language);
    this.saveLanguageToLocalStorage();
    this.loadLanguageData().subscribe();
  }

  private loadLanguageData(language: Languages = this.language.get(), changeGlobal: boolean = true) {
    return from(import("../../assets/lang/web/" + language + ".json"))
      .pipe(tap(data => {
        if (changeGlobal) {
          this.languageData = data.default;
          this.languageChange.next(this.language.get());
        }
      }));
  }

  public getCurrentLanguage(): Languages {
    return this.language.get();
  }

  public getTranslation(key: string, languageData = this.languageData): string {
    if(languageData[key] === undefined)
      return key;
    return languageData[key];
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
      return localStorageValue as Languages;
    } else {
      return Languages.English;
    }
  }

  /*
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
   */

  public static ifTranslationUndefinedBackup(data: Translation[], language: Languages, backup: Languages = TranslationService.BACKUP_LANGUAGE): string {
    if (!data) return "";

    const getTranslation = (lang: Languages) => data
      .filter((t: any) => t.language === lang)
      .map((t: any) => t.translation)[0];

    return getTranslation(language) || getTranslation(backup) || "";
  }

  public async getTranslationWithBackup(key: string, language: Languages = this.getCurrentLanguage(), backup: Languages = TranslationService.BACKUP_LANGUAGE): Promise<string> {

    let languageData = this.languageData;

    if(language !== this.getCurrentLanguage()) {
      const data = await import("../../assets/lang/web/" + language.toString() + ".json");
      languageData = data.default;
    }

    const getTranslation = (key: string, langData: any): Optional<string> => {
      const translation = this.getTranslation(key, langData);
      if(translation.toString() == key)
        return Optional.empty();
      return Optional.of(translation);
    }

    if(getTranslation(key, languageData).isPresent()) {
      return getTranslation(key, languageData).get();
    }

    const backupData = await import("../../assets/lang/web/" + backup.toString() + ".json");

    return getTranslation(key, backupData.default).orElse(key);
  }


}
