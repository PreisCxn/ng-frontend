import {Component, Inject, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {CategoryNavComponent} from "./section/hero/category-nav/category-nav.component";
import {ThemeService} from "./shared/theme.service";
import {ScrollLottieComponent} from "./section/scroll-lottie/scroll-lottie.component";
import {Breakpoint, BreakpointWidth} from "./shared/breakpoint";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, CategoryNavComponent, ScrollLottieComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'FE-PCXN-NG';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public theme: ThemeService,
    private breakpointObserver:  BreakpointObserver,
    private renderer: Renderer2) {
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
    this.theme.subscribe((darkMode: boolean) => {
      if (isPlatformBrowser(this.platformId)) {
        this.renderer.addClass(document.body, this.theme.darkMode ? 'dark-mode' : 'light-mode');
        this.renderer.removeClass(document.body, this.theme.darkMode ? 'light-mode' : 'dark-mode');
      }
    });
  }

}
