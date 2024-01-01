import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../shared/header.service";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {TranslationDirective} from "../shared/translation.directive";
import {TranslationService} from "../shared/translation.service";
import {Languages} from "../shared/languages";
import {ThemeService} from "../shared/theme.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslationDirective,
    NgOptimizedImage
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isLoaded: boolean = false;

  constructor(private translationService: TranslationService, public theme: ThemeService, private router: Router) {}

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

  navigateTo(route: string): void {
    this.router.navigate([route]).then();
  }

  ngOnInit(): void {
    console.log("fertig")
    this.isLoaded = true;
  }

}
