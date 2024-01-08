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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CategoryNavComponent,
    ScrollLottieComponent,
    SpinnerComponent
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public theme: ThemeService,
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
    private translationService: TranslationService,
    private router: Router,
    private loadingService: LoadingService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationStart) {
            this.loadingService.onNavigationStart(event, this.renderer);
          } else if (event instanceof NavigationEnd) {
            this.loadingService.onNavigationEnd(event, this.renderer);
          }
        });
      }
    });
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

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.translationService
        .getLanguageChange()
        .subscribe((loaded) => {
          if (loaded) {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {

              const bool = Date.now() - this.startTime > 600;

              if (bool) {
                this.renderer.addClass(loadingScreen, 'transition');
              }

              setTimeout(() => {
                if (bool) {
                  this.renderer.addClass(loadingScreen, 'hide');
                } else {
                  this.renderer.addClass(loadingScreen, 'hideOc');
                  setTimeout(() => {
                    this.renderer.addClass(loadingScreen, 'hide');
                  }, 400);
                }
                setTimeout(() => {
                  this.renderer.removeClass(document.body, 'no-transition');
                }, 10);
              }, 10);
            }
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
