import {Directive, ElementRef, HostListener, Inject, Input, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

/**
 * Enum für die Richtung des Parallax-Effekts.
 */
export enum Direction {
  positive = "+",
  negative = "-"
}

export class ParallaxBuilder {

    public static Direction = Direction;

    public static fromConfig(config: {
      valueName: string,
      position: number,
      direction: Direction,
      strength: number,
      scrollStart: number
    }): ParallaxBuilder {
      return new ParallaxBuilder()
        .setValueName(config.valueName)
        .setPosition(config.position)
        .setDirection(config.direction)
        .setStrength(config.strength)
        .setScrollStart(config.scrollStart);
    }

    public static create(): ParallaxBuilder {
      return new ParallaxBuilder();
    }

    public static defaultConfig(): ParallaxBuilder {
      return new ParallaxBuilder();
    }

    private config: {
      valueName: string,
      position: number,
      direction: Direction,
      strength: number,
      scrollStart: number
    } = {
      valueName: "top",
      position: 0,
      direction: Direction.positive,
      strength: 1,
      scrollStart: 0
    };

    public setValueName(valueName: string): ParallaxBuilder {
      this.config.valueName = valueName;
      return this;
    }

    public setPosition(position: number): ParallaxBuilder {
      this.config.position = position;
      return this;
    }

    public setDirection(direction: Direction): ParallaxBuilder {
      this.config.direction = direction;
      return this;
    }

    public setStrength(strength: number): ParallaxBuilder {
      this.config.strength = strength;
      return this;
    }

    public setScrollStart(scrollStart: number): ParallaxBuilder {
      this.config.scrollStart = scrollStart;
      return this;
    }

    public build(): {
      valueName: string,
      position: number,
      direction: Direction,
      strength: number,
      scrollStart: number
    } {
      return this.config;
    }
}

@Directive({
  selector: '[heroParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit {

  /**
   * Konfiguration für den Parallax-Effekt.
   * @param {string} valueName - Der Name der CSS-Eigenschaft, die geändert werden soll.
   * @param {number} position - Der Startwert der CSS-Eigenschaft.
   * @param {Direction} direction - Die Richtung des Parallax-Effekts.
   * @param {number} strength - Die Stärke des Parallax-Effekts.
   * @param {number} scrollStart - Der Scroll-Wert, bei dem der Parallax-Effekt beginnt.
   */
  @Input('heroParallax') builder: ParallaxBuilder | undefined;

  private config: {
    valueName: string,
    position: number,
    direction: Direction,
    strength: number,
    scrollStart: number
  } | undefined;

  /**
   * Gibt an, ob die Direktive aktiv ist.
   */
  private active: boolean = true;

  /**
   * Event-Listener für das Scroll-Ereignis.
   * @param {Event} event - Das Scroll-Ereignis.
   */
  @HostListener("window:scroll", ["$event"]) onWindowScroll(event: Event | null) {
    if (!this.active) return;
    if(this.config === undefined) return;
    if(event !== null && this.isOutsideViewport(this.ele)) return;

    let valueName:string = this.config.valueName;

    let style = (window.getComputedStyle(this.ele.nativeElement) as any);

    console.log('Style:', style[valueName])

    if(style[valueName] !== this.config.position + "px") {
      let number:number = parseInt(style[valueName].replace("px", ""));
      console.log('Number:', number);
      if(number < this.config.position + 80 || number > this.config.position - 80) {
        console.log("reset")
        this.renderer.setStyle(this.ele.nativeElement, this.config.valueName, this.config.position + "px");
      }
    }

    if(window.scrollY < this.config.scrollStart) {
      return;
    }

    let scrollY = window.scrollY - this.config.scrollStart;

    let value = `${this.config.direction === Direction.positive ? this.config.position + scrollY * this.config.strength : this.config.position - scrollY * this.config.strength}px`;

    this.renderer.setStyle(this.ele.nativeElement, this.config.valueName, value);

  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ele: ElementRef,
    private renderer: Renderer2) {
    this.config = this.builder?.build();
  }

  /**
   * Lifecycle-Hook, der aufgerufen wird, wenn die Direktive initialisiert wird.
   * setzt die standartmäßigen CSS-Eigenschaften für die Direktive.
   */
  ngOnInit(): void {
    this.config = this.builder?.build();

    if(this.config === undefined) return;

    this.renderer.setStyle(this.ele.nativeElement, "position", "relative");
    this.renderer.setStyle(this.ele.nativeElement, "top", this.config.position + "px");

    if(isPlatformBrowser(this.platformId))
      this.onWindowScroll(null);
  }

  /**
   * Setzt den aktiven Status der Direktive.
   * @param {boolean} active - Der neue aktive Status der Direktive.
   */
  private setActive(active: boolean) {
    this.active = active;
  }

  /**
   * Aktiviert den Parallax-Effekt.
   */
  public activate() {
    this.setActive(true);
  }

  /**
   * Deaktiviert den Parallax-Effekt.
   */
  public deactivate() {
    this.setActive(false);
  }

  /**
   * Überprüft, ob ein Element außerhalb des Viewports ist.
   * @param {ElementRef} ele - Das Element, das überprüft werden soll.
   * @return {boolean} - Gibt `true` zurück, wenn das Element außerhalb des Viewports ist, sonst `false`.
   */
  private isOutsideViewport(ele: ElementRef): boolean {
    const rect = ele.nativeElement.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    return rect.top >= windowHeight ||
      rect.left >= windowWidth ||
      rect.bottom <= 0 ||
      rect.right <= 0;
  }

}
