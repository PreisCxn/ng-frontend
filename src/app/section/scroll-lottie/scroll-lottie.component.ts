import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import lottie from 'lottie-web';
import {Optional} from "../../shared/optional";

@Component({
  selector: 'section-scroll-lottie',
  standalone: true,
  imports: [],
  templateUrl: './scroll-lottie.component.html',
  styleUrl: './scroll-lottie.component.scss'
})
export class ScrollLottieComponent implements AfterViewInit {
  // @ts-ignore
  @ViewChild('lottieContainer') lottieContainer: ElementRef;
  animation: any;
  @Input('length') animLength: number = -1; // so lange soll gescrollt werden können
  @Input('topDistance') scrollTop: number = -1; // entfernung von oben


  // picture
  private lottieHeight: Optional<number> = Optional.empty();
  private lottieWidth: Optional<number> = Optional.empty();
  private lottieTop: Optional<number> = Optional.empty();
  private lottieBottom: Optional<number> = Optional.empty();

  // DOM ELEMENTS
  private outer: Optional<ElementRef> = Optional.empty();
  private inner: Optional<ElementRef> = Optional.empty();

  // Animations Daten
  private totalFrames: Optional<number> = Optional.empty(); // Frames der Animation
  private scrollStart: Optional<number> = Optional.empty(); // start der animation

  constructor(public renderer: Renderer2) { }

  ngAfterViewInit(): void {
    if(this.scrollTop < 0 || this.animLength < 0) {
      this.hide();
      throw new Error('ScrollLottieComponent: animationLength and scrollTop must be set');
    }

    this.animation = lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'assets/lottie.json'
    });

    this.outer = Optional.of(this.renderer.parentNode(this.lottieContainer.nativeElement));
    this.inner = Optional.of(this.lottieContainer.nativeElement);

    this.animation.addEventListener('DOMLoaded', () => {
      this.initLottie();
      this.onWindowScroll(null);
    });

    //setzen des abstandes oben für den sticky effekt
    this.setTop(this.scrollTop);
    //setzen der höhe des containers in dem sich das sticky element befindet
    this.setHeight(this.animLength);
  }

  private setTop(top: number) {
    this.inner.ifPresent(inner => this.renderer.setStyle(inner, 'top', top + 'px'));
  }

  private hide() {
    this.outer.ifPresent(outer => this.renderer.setStyle(outer, 'visibility', 'hidden'));
  }

  private setHeight(height: number) {
    this.outer.ifPresent(outer => this.renderer.setStyle(outer, 'height', height + 'px'));
  }

  private initLottie() {
    this.lottieWidth = Optional.of(this.lottieContainer.nativeElement.getBoundingClientRect().width);
    this.lottieTop = Optional.of(this.renderer.parentNode(this.lottieContainer.nativeElement).getBoundingClientRect().top + window.scrollY);
    this.lottieBottom = Optional.of(this.lottieContainer.nativeElement.getBoundingClientRect().bottom + window.scrollY);
    this.lottieHeight = Optional.of(this.lottieContainer.nativeElement.getBoundingClientRect().height);

    this.lottieHeight.ifPresent(height => this.setHeight(this.animLength + height));
    this.lottieTop.ifPresent(top => this.scrollStart = Optional.of(top - this.scrollTop));
    this.totalFrames = Optional.of(this.animation.totalFrames);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {

    if(this.lottieHeight.isEmpty()) {
      this.initLottie();
      if(this.lottieHeight.isEmpty()) return;
    }

    if(this.scrollStart.isEmpty()) return;

    const scrollY = window.scrollY; // aktuelle scroll position

    const scrollEnd = this.scrollStart.get() + this.animLength; // ende der animation insgesamt
    const animationScroll = scrollY - this.scrollStart.get(); // aktuelle scroll position der animation
    const scrollFraction = (scrollEnd - this.scrollStart.get()) / this.totalFrames.get(); // frames pro scroll

    if (animationScroll < 0 || animationScroll > this.animLength) return;

    const frameNumber = Math.floor(animationScroll / scrollFraction); // aktueller frame
    if(frameNumber > this.totalFrames.get()) {
      this.animation.goToAndStop(this.totalFrames.get(), true);
    } else if (frameNumber < 0) {
      this.animation.goToAndStop(0, true);
    } else {
      this.animation.goToAndStop(frameNumber, true);
    }

  }

}
