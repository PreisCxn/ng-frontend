import { Injectable } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslationService} from "./translation.service";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private static readonly siteTitle:string = "PriceCxn"
  private sectionTitle: string = "";

  showSearch: boolean = false;

  constructor(private titleService: Title, private translation: TranslationService) {
    this.clearSectionTitle();
  }

  public setSectionTitle(title: string): void {
    this.sectionTitle = title;
    if(this.sectionTitle == "")
      this.titleService.setTitle(HeaderService.siteTitle);
    else
      this.titleService.setTitle(HeaderService.siteTitle + " | " + this.sectionTitle);
  }

  public setSectionTitleByLanguageKey(key: string): void {
    this.translation.subscribe(language => {
      this.setSectionTitle(this.translation.getTranslation(key));
    })
  }

  public clearSectionTitle(): void {
    this.setSectionTitle("");
  }

}
