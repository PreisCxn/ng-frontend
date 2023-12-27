import {Injectable} from '@angular/core';
import {Languages} from "./languages";
import {from, Observable, Subject} from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private language: Languages = Languages.English;
  private languageData: { [key: string]: string } = {};
  private languageChange: Subject<Languages> = new Subject<Languages>();

  constructor() {
    this.setLanguage(this.language);
  }

  public setLanguage(language: Languages) {
    this.language = language;
    this.loadLanguageData().subscribe();
  }

  private loadLanguageData() {
    return from(import("../../assets/lang/web/" + this.language + ".json"))
      .pipe(tap(data => {
        this.languageData = data.default;
        this.languageChange.next(this.language);
      }));
  }

  public getCurrentLanguage(): Languages {
    return this.language;
  }

  public getTranslation(key: string): string {
    return this.languageData[key];
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

}
