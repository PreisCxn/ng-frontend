import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import lottie from 'lottie-web';
import {Optional} from "../../shared/optional";
import {Breakpoint} from "../../shared/breakpoint";

@Component({
  selector: 'section-scroll-lottie',
  standalone: true,
  imports: [],
  templateUrl: './scroll-lottie.component.html',
  styleUrl: './scroll-lottie.component.scss'
})
/**
 * ScrollLottieComponent ist eine Angular-Komponente, die eine Lottie-Animation lädt und steuert.
 * Die Animation wird durch Scrollen gesteuert und kann an eine bestimmte Scroll-Position und -Länge angepasst werden.
 */
export class ScrollLottieComponent implements AfterViewInit {
  // @ts-ignore
  @ViewChild('lottieContainer') lottieContainer: ElementRef;

  /**
   * Die Länge der Animation in Pixeln. Bestimmt, wie lange gescrollt werden kann.
   * @type {number}
   */
  @Input('length') length: Breakpoint | number = -1; // so lange soll gescrollt werden können

  /**
   * Der Abstand von oben (vom Seitenanfang) in Pixeln. Bestimmt, wie viel Abstand nach oben sein muss um die animation zu starten
   * @type {number}
   */
  @Input('topDistance') topDistance: Breakpoint | number = -1; // entfernung von oben

  private initialized: boolean = false;

  // picture
  private lottieHeight: Optional<number> = Optional.empty();
  private lottieWidth: Optional<number> = Optional.empty();
  private lottieTop: Optional<number> = Optional.empty();
  private lottieBottom: Optional<number> = Optional.empty();

  // DOM ELEMENTS
  private outer: Optional<ElementRef> = Optional.empty();
  private inner: Optional<ElementRef> = Optional.empty();

  // Animations Daten
  private animation: any; // lottie animation
  private totalFrames: Optional<number> = Optional.empty(); // Frames der Animation
  private scrollStart: Optional<number> = Optional.empty(); // start der animation

  // settings
  private scrollTop: number = -1; // entfernung von oben
  private animLength: number = -1; // so lange soll gescrollt werden können

  constructor(private ele: ElementRef, private renderer: Renderer2) { }

  /**
   * Initialisiert die Lottie-Animation und fügt einen Event-Listener für das 'DOMLoaded'-Ereignis hinzu.
   * Setzt auch die Höhe und den Abstand von oben für das Sticky-Element.
   */
  ngAfterViewInit(): void {

    if (this.length instanceof Breakpoint) {
      this.length.subscribe(value => {
        this.animLength = value
        this.setHeight(this.animLength);
        if(this.initialized)
          this.initLottie();

        console.log("Breakpoint Length: " + this.animLength)
      });
    } else {
      this.animLength = this.length;
    }
    if (this.topDistance instanceof Breakpoint) {
      this.topDistance.subscribe(value => {
        this.scrollTop = value
        this.setTop(this.scrollTop);
        if(this.initialized)
          this.initLottie();
        console.log("Breakpoint TopDistance: " + this.scrollTop);
      });
    } else {
      this.scrollTop = this.topDistance;
    }

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

  /**
   * Versteckt die Komponente.
   */
  private hide() {
    this.outer.ifPresent(outer => this.renderer.setStyle(outer, 'visibility', 'hidden'));
  }

  private setHeight(height: number) {
    this.outer.ifPresent(outer => this.renderer.setStyle(outer, 'height', height + 'px'));
  }

  /**
   * Initialisiert die Lottie-Animation und berechnet die notwendigen Werte für die Scroll-Steuerung.
   */
  private initLottie() {

    if(!this.initialized)
      this.initialized = true;

    this.lottieWidth = Optional.of(this.lottieContainer.nativeElement.getBoundingClientRect().width);
    this.lottieTop = Optional.of(this.renderer.parentNode(this.lottieContainer.nativeElement).getBoundingClientRect().top + window.scrollY);
    this.lottieTop.ifPresent(top => {
      if(top < this.scrollTop) {
        this.renderer.setStyle(this.ele.nativeElement, 'top', `${this.scrollTop}px`);
        this.lottieTop = Optional.of(this.scrollTop);
      }
    });
    this.lottieBottom = Optional.of(this.lottieContainer.nativeElement.getBoundingClientRect().bottom + window.scrollY);
    this.lottieHeight = Optional.of(this.lottieContainer.nativeElement.getBoundingClientRect().height);

    this.lottieHeight.ifPresent(height => this.setHeight(this.animLength + height));
    this.lottieTop.ifPresent(top => {
      if(top < this.scrollTop) {
        this.renderer.setStyle(this.ele.nativeElement, 'top', `${this.scrollTop}px`);
      }
      this.scrollStart = Optional.of(top - this.scrollTop)
    });
    this.totalFrames = Optional.of(this.animation.totalFrames);
  }

  /**
   * Wird aufgerufen, wenn das Fenster gescrollt wird.
   * Steuert die Animation basierend auf der aktuellen Scroll-Position.
   * @param {any} event - Das Scroll-Ereignis.
   */
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
