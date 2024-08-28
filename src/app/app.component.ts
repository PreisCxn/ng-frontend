import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {NavigationEnd, NavigationStart, Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {ThemeService} from "./shared/theme.service";
import {ScrollLottieComponent} from "./section/scroll-lottie/scroll-lottie.component";
import {Breakpoint, BreakpointWidth} from "./shared/breakpoint";
import {BreakpointObserver} from "@angular/cdk/layout";
import {TranslationService} from "./shared/translation.service";
import {SpinnerComponent} from "./spinner/spinner.component";
import {LoadingService} from "./shared/loading.service";
import {HttpClientModule} from "@angular/common/http";
import {RedirectService} from "./shared/redirect.service";
import {NgcCookieConsentModule, NgcCookieConsentService} from "ngx-cookieconsent";
import {Accessibility, AccessibilityService} from "./shared/accessibility.service";
import {SwUpdate} from "@angular/service-worker";
import {CallToActionServiceService} from "./shared/call-to-action-service.service";

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
    HttpClientModule,
    NgcCookieConsentModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  // @ts-ignore
  @ViewChild('lottieContainer') lottieContainer: ElementRef;

  title = 'FE-PCXN-NG';

  private static readonly version = '1.2.0';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public theme: ThemeService,
    public access: AccessibilityService,
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
    private translationService: TranslationService,
    private router: Router,
    private loadingService: LoadingService,
    private ccService: NgcCookieConsentService,
    private callToAction: CallToActionServiceService,
    private redirect: RedirectService,
    updates: SwUpdate) {
    updates.checkForUpdate().then(bool => {
      if (bool) {
        console.log("Update available! Updating to new version...");
        updates.activateUpdate().then(() => {
          document.location.reload();
        });
      }
    });
    console.log("Version: " + AppComponent.version);
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
    this.theme.subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.renderer.addClass(document.body, this.theme.darkMode ? 'dark-mode' : 'light-mode');
        this.renderer.removeClass(document.body, this.theme.darkMode ? 'light-mode' : 'dark-mode');
      }
    });
    this.access.subscribe((state: Accessibility) => {
      if (isPlatformBrowser(this.platformId)) {
        console.log(state);
        const isOn = state == Accessibility.ON;
        this.renderer.addClass(document.body, isOn ? 'acc-on' : 'acc-off');
        this.renderer.removeClass(document.body, isOn ? 'acc-off' : 'acc-on');
      }
    });
  }

  private translationFinished: boolean = false;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {

      //this.translationService.subscribe(this.languageChanged);

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loadingService.onNavigationStart(event, this.renderer);
          this.translationFinished = false;
        } else if (event instanceof NavigationEnd) {
          this.loadingService.onNavigationEnd(event, this.renderer).then(() => {
            setTimeout(() => {
              this.callToAction.onNavigationEnd();
            }, 100);
          }).catch(error => {
            console.log(error)
          });
        }
      });

      this.redirect.checkRedirectNotifys();

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

  ngOnDestroy(): void {
  }

}
