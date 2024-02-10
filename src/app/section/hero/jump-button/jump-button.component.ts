import {AfterViewInit, Component, ElementRef, Inject, Input, PLATFORM_ID, ViewChild} from '@angular/core';
import {HeroModule} from "../hero.module";
import {isPlatformBrowser} from "@angular/common";
import lottie from "lottie-web";
import {ThemeService} from "../../../shared/theme.service";
import {ParallaxBuilder} from "../shared/parallax.directive";
import {RedirectService} from "../../../shared/redirect.service";

@Component({
  selector: 'hero-jump-button',
  templateUrl: './jump-button.component.html',
  styleUrl: './jump-button.component.scss'
})
export class JumpButtonComponent implements AfterViewInit {

  public static readonly customParallax: ParallaxBuilder = ParallaxBuilder
    .create()
    .setStrength(0.27)
    .setDirection(ParallaxBuilder.Direction.positive)
    .setValueName("top")
    .setScrollStart(0)
    .setPosition(0);

  @ViewChild('jumpButtonLottie') lottie: ElementRef | undefined;

  @Input('parallax') parallax: any = ParallaxBuilder.defaultConfig();

  private jumpButtonAnimation: any; // jump button animation object

  private hover: boolean = false;

  constructor(public theme: ThemeService, @Inject(PLATFORM_ID) private platformId: Object, protected redirect: RedirectService) {
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if(this.lottie == undefined) return;

      this.jumpButtonAnimation = lottie.loadAnimation({
        container: this.lottie.nativeElement,
        renderer: 'canvas',
        loop: true,
        autoplay: false,
        path: 'assets/img/icons/jumpButton.json'
      });
      this.jumpButtonAnimation.goToAndStop(14, true);

      const onEnterFrame = () => {
        if (Math.round(this.jumpButtonAnimation.currentFrame) === 14) {
          if (!this.hover) {
            this.jumpButtonAnimation.pause();
          }
          this.jumpButtonAnimation.removeEventListener('enterFrame', onEnterFrame);
        }
      };

      this.lottie.nativeElement.addEventListener('mouseenter', () => {
        this.hover = true;
        this.jumpButtonAnimation.play();
      });
      this.lottie.nativeElement.addEventListener('mouseleave', () => {
        this.hover = false;
        this.jumpButtonAnimation.play();
        this.jumpButtonAnimation.addEventListener('enterFrame', onEnterFrame);
      });
    }
  }

}
