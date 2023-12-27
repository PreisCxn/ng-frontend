import { Injectable } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslationService} from "./translation.service";
import {startWith, Subscription} from "rxjs";
import {Optional} from "./optional";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private static readonly siteTitle:string = "PriceCxn"
  private sectionTitle: Optional<string> = Optional.empty();
  private titleSubscription: Subscription | null = null;

  showSearch: boolean = false;

  constructor(private titleService: Title, private translation: TranslationService) {
    this.clearSectionTitle();
  }

  public setSectionTitle(title: string): void {
    this.sectionTitle = Optional.of(title);
    if(this.sectionTitle.isEmpty() || this.sectionTitle.get().length == 0)
      this.titleService.setTitle(HeaderService.siteTitle);
    else
      this.titleService.setTitle(HeaderService.siteTitle + " | " + this.sectionTitle.get());
  }

  public setSectionTitleByLanguageKey(key: string): void {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
    this.titleSubscription = this.translation.pipe(startWith(null)).subscribe(language => {
      this.setSectionTitle(this.translation.getTranslation(key));
    });
  }

  public clearSectionTitle(): void {
    this.setSectionTitle("");
  }

}
