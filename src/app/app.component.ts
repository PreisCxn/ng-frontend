import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {HeaderService} from "./shared/header.service";
import {CategoryNavComponent} from "./section/hero/category-nav/category-nav.component";
import {ThemeService} from "./shared/theme.service";
import {ScrollLottieComponent} from "./section/scroll-lottie/scroll-lottie.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, CategoryNavComponent, ScrollLottieComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FE-PCXN-NG';

  constructor(public theme: ThemeService) { }

}
