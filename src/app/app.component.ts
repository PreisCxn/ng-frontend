import {AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {CategoryNavComponent} from "./section/hero/category-nav/category-nav.component";
import {ThemeService} from "./shared/theme.service";
import {ScrollLottieComponent} from "./section/scroll-lottie/scroll-lottie.component";
import {Breakpoint, BreakpointWidth} from "./shared/breakpoint";
import {BreakpointObserver} from "@angular/cdk/layout";
import {TranslationService} from "./shared/translation.service";
import {SpinnerComponent} from "./spinner/spinner.component";
import {LoadingService} from "./shared/loading.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ScrollLottieComponent,
    SpinnerComponent,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  @ViewChild('lottieContainer') lottieContainer: ElementRef;
  private animation: any;

  title = 'FE-PCXN-NG';

  private startTime: number = Date.now();

  private init: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public theme: ThemeService,
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
    private translationService: TranslationService,
    private router: Router,
    private loadingService: LoadingService) {
  }

  public lottieLength: Breakpoint = new Breakpoint(this.breakpointObserver)
    .initFlex([
      [BreakpointWidth.minWidth(768), 300],
      [BreakpointWidth.minWidth(320), 500]
    ], 1000);

  public lottieTopDistance: Breakpoint = new Breakpoint(this.breakpointObserver)
    .initFlex([
      [BreakpointWidth.minWidth(768), 300],
      [BreakpointWidth.minWidth(320), 500]
    ], 400);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    }

    this.theme.subscribe((darkMode: boolean) => {
      if (isPlatformBrowser(this.platformId)) {
        this.renderer.addClass(document.body, this.theme.darkMode ? 'dark-mode' : 'light-mode');
        this.renderer.removeClass(document.body, this.theme.darkMode ? 'light-mode' : 'dark-mode');
      }
    });
  }

  private translationFinished: boolean = false;

  languageChanged(language: string) {
    if(!this.translationFinished) return;

    this.translationFinished = true;
    this.loadingService.onNavigationEnd(null, this.renderer).then(r => {
    }).catch(error => {
      console.log(error)
    });
  }

  ngAfterViewInit(): void {

    if (isPlatformBrowser(this.platformId)) {

      //this.translationService.subscribe(this.languageChanged);

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          console.log("navigation start")
          this.loadingService.onNavigationStart(event, this.renderer);
          this.translationFinished = false;
        } else if (event instanceof NavigationEnd) {
          console.log("navigation end")
          this.loadingService.onNavigationEnd(event, this.renderer).then(r => {
          }).catch(error => {
            console.log(error)
          });
        }
      });

      //this.loadingService.onNavigationEnd(null, this.renderer).then(r => {
     // });

      /*
      this.translationService
        .getLanguageChange()
        .subscribe((loaded) => {
          if (loaded) {
            this.router.events.subscribe((event) => {
              if (event instanceof NavigationStart) {
                this.loadingService.onNavigationStart(event, this.renderer);
              } else if (event instanceof NavigationEnd) {
                this.loadingService.onNavigationEnd(event, this.renderer).then(r => {
                });
              }
            });
            this.loadingService.onNavigationEnd(null, this.renderer).then(r => {});
          }
        });

      /*
      window.addEventListener('load', () => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
          this.renderer.setStyle(loadingScreen, 'display', 'none');
        }
      });
      */

    }

  }

}
