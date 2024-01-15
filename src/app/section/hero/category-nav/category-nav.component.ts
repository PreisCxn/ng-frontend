import {AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {Direction, ParallaxBuilder, ParallaxDirective} from "../shared/parallax.directive";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Breakpoint} from "../../../shared/breakpoint";
import {isPlatformBrowser} from "@angular/common";
import lottie from "lottie-web";
import {CategoryEntry} from "../../../shared/pcxn.types";
import {ModeService} from "../../../mode/shared/mode.service";
import {RedirectService} from "../../../shared/redirect.service";
import {Modes} from "../../../mode/shared/modes";
import {TranslationService} from "../../../shared/translation.service";

@Component({
  selector: 'hero-category-nav',
  templateUrl: './category-nav.component.html',
  styleUrl: './category-nav.component.scss'
})
export class CategoryNavComponent implements OnInit {

  @Input('parallax') parallax: ParallaxBuilder = ParallaxBuilder.defaultConfig();
  @Input('categories') categories: CategoryEntry[] = [];

  activeCategory: CategoryEntry = this.categories[0]; // Set the first category as the active one by default

  setActiveCategory(category: CategoryEntry) {
    this.activeCategory = category;
  }

  constructor(protected modeService: ModeService, protected redirect: RedirectService, private translation: TranslationService) { }

  ngOnInit(): void {

  }

  protected getCategoryName(category: CategoryEntry): string {
    return 'translatableKey' in category.translationData ? this.translation.getTranslation(category.translationData.translatableKey) : category.translationData.translation;
  }

  protected readonly ParallaxBuilder = ParallaxBuilder;
  protected readonly Modes = Modes;
  protected readonly ModeService = ModeService;
}
