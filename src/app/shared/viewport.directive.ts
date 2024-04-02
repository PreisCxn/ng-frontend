import {Directive, ElementRef, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appViewport]',
  standalone: true
})
export class ViewportDirective {
  @Input() appViewport: boolean = true;

  private observer: IntersectionObserver | undefined;

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.observer = new IntersectionObserver(([entry]) => {
      this.appViewport = entry.isIntersecting;
      if (entry.isIntersecting) {
        this.renderer.setStyle(this.element.nativeElement, 'visibility', 'visible');
      } else {
        this.renderer.setStyle(this.element.nativeElement, 'visibility', 'hidden');
      }
    });

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
