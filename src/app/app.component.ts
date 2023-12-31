import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class AppComponent {
  title = 'FE-PCXN-NG';

  constructor(public theme: ThemeService, private breakpointObserver:  BreakpointObserver) {
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

}
