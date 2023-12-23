import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../shared/header.service";
import {CommonModule} from "@angular/common";
import {TranslationDirective} from "../shared/translation.directive";
import {TranslationService} from "../shared/translation.service";
import {Languages} from "../shared/languages";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslationDirective
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  darkMode: boolean = true;

  constructor(public headerService: HeaderService, private translationService: TranslationService) {
  }

  toggleMode(): void {
    this.darkMode = !this.darkMode;
  }

  toggleLanguage(): void {
    console.log("1");
    switch (this.translationService.getCurrentLanguage()) {
      case Languages.English:
        this.translationService.setLanguage(Languages.German);
        break;
      case Languages.German:
        this.translationService.setLanguage(Languages.MemeCxn);
        break;
      case Languages.MemeCxn:
        this.translationService.setLanguage(Languages.English);
        break;
      default:
        this.translationService.setLanguage(Languages.English);
        break;
    }
  }

  protected readonly Languages = Languages;
}
