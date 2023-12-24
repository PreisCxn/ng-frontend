import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {TranslationService} from "./translation.service";

@Directive({
  selector: '[translation]',
  standalone: true
})
export class TranslationDirective implements OnInit {

  @Input('translation') languageKey:any;

  constructor(private ele: ElementRef, private translation: TranslationService) { }

  ngOnInit() {
    this.translation
      .subscribe((translation) => {
        this.ele.nativeElement.innerText = this.translation.getTranslation(this.languageKey);
    });
  }

}
