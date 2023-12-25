import {Directive, ElementRef, HostListener, Input} from '@angular/core';

export enum Direction {
  positive = "+",
  negative = "-"
}

@Directive({
  selector: '[heroParallax]',
  standalone: true
})
export class ParallaxDirective {

  @Input('heroParallax') settings:[valueName: string, maxValue: number, direction: Direction]  = ["translateY", 0, Direction.positive];

  @HostListener("window:scroll", ["$event"]) onWindowScroll(event: Event) {

  }

  constructor(private ele: ElementRef) { }

}
