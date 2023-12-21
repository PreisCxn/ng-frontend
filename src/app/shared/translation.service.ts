import {Injectable} from '@angular/core';
import {Languages} from "./languages";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private language: Languages = Languages.English;
  private languageData: { [key: string]: string } = {};

  constructor() {
    this.setLanguage(this.language).then(() => {
    });
  }

  public async setLanguage(language: Languages) {
    this.language = language;
    this.languageData = await this.loadLanguageData();
  }

  private async loadLanguageData(): Promise<{ [key: string]: string }> {
    return await import("../../assets/lang/web/" + this.language + ".json");
  }

  getCurrentLanguage(): Languages {
    return this.language;
  }

  public getTranslation(key: string): string {
    return this.languageData[key];
  }

}
