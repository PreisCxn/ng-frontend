import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {TranslationService} from "./translation.service";

@Directive({
  selector: '[translation]',
  standalone: true
})
export class TranslationDirective implements OnInit {

  @Input('translation') languageKey:any;

  constructor(private ele: ElementRef, private translation: TranslationService, private renderer: Renderer2) {
    this.renderer.setStyle(this.ele.nativeElement, 'visibility', 'hidden');
  }

  ngOnInit() {
    this.translation
      .subscribe((language) => {
        const translation: string = this.translation.getTranslation(this.languageKey);
        this.ele.nativeElement.innerText = translation;
        this.updateVisibility(translation);
    });
  }

  private updateVisibility(translation: string): void {
    if(translation == undefined) return;
    if (translation.length > 0) {
      this.renderer.setStyle(this.ele.nativeElement, 'visibility', 'visible');
    } else {
      this.renderer.setStyle(this.ele.nativeElement, 'visibility', 'hidden');
    }
  }

}
