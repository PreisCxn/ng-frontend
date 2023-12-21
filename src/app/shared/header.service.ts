import { Injectable } from '@angular/core';
import {Title} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private static readonly siteTitle:string = "PriceCxn"
  private sectionTitle: string = "";

  showSearch: boolean = false;

  constructor(private titleService: Title) {
    this.clearSectionTitle();
  }

  public setSectionTitle(title: string): void {
    this.sectionTitle = title;
    if(this.sectionTitle == "")
      this.titleService.setTitle(HeaderService.siteTitle);
    else
      this.titleService.setTitle(HeaderService.siteTitle + " | " + this.sectionTitle);
  }

  public clearSectionTitle(): void {
    this.setSectionTitle("");
  }

}
