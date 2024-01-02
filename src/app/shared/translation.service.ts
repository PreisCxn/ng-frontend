import {Injectable} from '@angular/core';
import {Languages} from "./languages";
import {from, Observable, startWith, Subject} from 'rxjs';
import { tap } from 'rxjs/operators';
import {CookieService} from "ngx-cookie-service";
import {Optional} from "./optional";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private language: Optional<Languages> = Optional.of(this.getLanguageFromCookie().toString() === "" ? Languages.English : this.getLanguageFromCookie());
  private languageData: { [key: string]: string } = {};
  private languageChange: Subject<Languages> = new Subject<Languages>();

  constructor(private cookieService: CookieService) {
    this.setLanguage(this.language.orElse(Languages.English));
  }

  public setLanguage(language: Languages) {
    this.language = Optional.of(language);
    this.saveLanguageToCookie();
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

  private saveLanguageToCookie(): void {
    this.cookieService.set('language', this.language.get());
  }

  private getLanguageFromCookie(): Languages {
    const cookieValue = this.cookieService.get('language');
    console.log(cookieValue)
    return cookieValue as Languages;
  }

}
