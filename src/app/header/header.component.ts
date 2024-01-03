import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {HeaderService} from "../shared/header.service";
import {CommonModule, isPlatformBrowser, NgOptimizedImage} from "@angular/common";
import {TranslationDirective} from "../shared/translation.directive";
import {TranslationService} from "../shared/translation.service";
import {Languages} from "../shared/languages";
import {ThemeService} from "../shared/theme.service";
import {Router} from "@angular/router";
import {RedirectService} from "../shared/redirect.service";
import lottie from "lottie-web";


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
export class HeaderComponent implements OnInit, AfterViewInit{
  // @ts-ignore
  @ViewChild('lottiemenu') lottieMenu: ElementRef;
  // @ts-ignore
  @ViewChild('header') header: ElementRef;

  // @ts-ignore
  private clickOutsideListener: (event: MouseEvent) => void;

  private menuAnimation: any; // menu animation

  isLoaded: boolean = false;

  public menuOpen: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService,
    public theme: ThemeService,
    public redirectService: RedirectService) {
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

  ngOnInit(): void {
    console.log("fertig")
    console.log(this.theme.darkMode);
    this.isLoaded = true;
  }

  public toggleMenu(): void {
    if (this.menuOpen) {
      this.menuAnimation.playSegments([29, 0], true); // play animation in reverse from frame 90 to 0
    } else {
      this.menuAnimation.playSegments([0, 29], true); // play animation forward from frame 0 to 90
    }
    this.menuOpen = !this.menuOpen;
  }

  private handleClickOutside(event: MouseEvent): void {
    console.log("click");
    if(this.menuOpen) {
      console.log(!this.header.nativeElement.contains(event.target))
      if (!this.header.nativeElement.contains(event.target)) {
        this.toggleMenu();
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.menuAnimation = lottie.loadAnimation({
        container: this.lottieMenu.nativeElement,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'assets/img/icons/menu.json'
      });

      this.menuAnimation.setSpeed(2.0);

      if(this.menuOpen) {
        this.menuAnimation.goToAndStop(29, true);
      }

      this.clickOutsideListener = this.handleClickOutside.bind(this);
      document.addEventListener('click', this.clickOutsideListener);
    }
  }


  }
