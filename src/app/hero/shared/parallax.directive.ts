import {Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';

/**
 * Enum für die Richtung des Parallax-Effekts.
 */
export enum Direction {
  positive = "+",
  negative = "-"
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
  @Input('heroParallax') config: {
    valueName: string,
    position: number,
    direction: Direction,
    strength: number,
    scrollStart: number
  } = {valueName: "top", position: 1, direction: Direction.positive, strength: 1, scrollStart: 0};

  /**
   * Gibt an, ob die Direktive aktiv ist.
   */
  private active: boolean = true;

  /**
   * Event-Listener für das Scroll-Ereignis.
   * @param {Event} event - Das Scroll-Ereignis.
   */
  @HostListener("window:scroll", ["$event"]) onWindowScroll(event: Event) {
    if (!this.active) return;
    if(this.isOutsideViewport(this.ele)) return;

    console.log('Scroll event:', window.scrollY);

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

  constructor(private ele: ElementRef, private renderer: Renderer2) {
  }

  /**
   * Lifecycle-Hook, der aufgerufen wird, wenn die Direktive initialisiert wird.
   * setzt die standartmäßigen CSS-Eigenschaften für die Direktive.
   */
  ngOnInit(): void {
    this.renderer.setStyle(this.ele.nativeElement, "position", "absolute");
    this.renderer.setStyle(this.ele.nativeElement, "top", this.config.position + "px");
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
