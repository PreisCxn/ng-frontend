import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ParallaxBuilder} from "../shared/parallax.directive";


@Component({
  selector: 'hero-image',
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent implements AfterViewInit {

  @Input() src: string | undefined;

  @Input() alt: string | undefined;

  @Input() parallax: ParallaxBuilder = ParallaxBuilder.defaultConfig();

  @ViewChild('image') image: ElementRef | undefined;

  @Input('show') showE: boolean = false;

  constructor(private renderer: Renderer2) {
  }

  public show(): void {
    console.log("1")
    if(this.image === undefined) return;
    console.log("2")
    this.renderer.setStyle(this.image.nativeElement, 'opacity', '1');
  }

  public hide(): void {
    if(this.image === undefined) return;
    this.renderer.setStyle(this.image.nativeElement, 'opacity', '0');
  }

  ngAfterViewInit(): void {
    if(this.showE)
      this.show();
    else
      this.hide();
  }

}
