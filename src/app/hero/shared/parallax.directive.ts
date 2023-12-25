import {Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';

export enum Direction {
  positive = "+",
  negative = "-"
}

@Directive({
  selector: '[heroParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit {

  @Input('heroParallax') config: {
    valueName: string,
    position: number,
    direction: Direction,
    strength: number,
    scrollStart: number
  } = {valueName: "top", position: 1, direction: Direction.positive, strength: 1, scrollStart: 0};

  private active: boolean = true;

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

  ngOnInit(): void {
    this.renderer.setStyle(this.ele.nativeElement, "position", "absolute");
    this.renderer.setStyle(this.ele.nativeElement, "top", this.config.position + "px");
  }

  private setActive(active: boolean) {
    this.active = active;
  }

  public activate() {
    this.setActive(true);
  }

  public deactivate() {
    this.setActive(false);
  }

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
