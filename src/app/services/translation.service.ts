import { Injectable } from '@angular/core';
import {Languages} from "./languages";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private language: Languages = Languages.English;
  private languageData: { [key: string]: string }  = {};

  constructor() {
    this.setLanguage(this.language);
  }

  public setLanguage(language: Languages): void {
    this.language = language;
    this.loadLanguageData().then(data => {
      this.languageData = data;
    });
  }

  private async loadLanguageData() : Promise<{ [key: string]: string }> {
    return await import("../../assets/lang/" + this.language + ".json");
  }

}
