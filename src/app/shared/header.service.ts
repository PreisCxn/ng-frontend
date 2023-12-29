import { Injectable } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslationService} from "./translation.service";
import {startWith, Subscription} from "rxjs";
import {Optional} from "./optional";
import {ThemeService} from "./theme.service";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private static readonly siteTitle:string = "PriceCxn"
  private sectionTitle: Optional<string> = Optional.empty();
  private titleSubscription: Subscription | null = null;

  showSearch: boolean = false;

  private searchKey: string = "";

  constructor(private titleService: Title, private translation: TranslationService) {
    this.clearSectionTitle();
  }

  public setSectionTitle(title: string): void {
    this.sectionTitle = Optional.of(title);
    if(this.sectionTitle.isEmpty() || this.sectionTitle.get().length == 0)
      this.titleService.setTitle(HeaderService.siteTitle);
    else
      this.titleService.setTitle(this.sectionTitle.get() + " | " + HeaderService.siteTitle);
  }



  public setSectionTitleByLanguageKey(key: string): void {
    console.log(key);
    this.searchKey = key;
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
    this.titleSubscription = this.translation.pipe(startWith(null)).subscribe(language => {
      this.setSectionTitle(this.translation.getTranslation(this.searchKey));
    });
  }

  public clearSectionTitle(): void {
    this.setSectionTitle("");
  }

}
