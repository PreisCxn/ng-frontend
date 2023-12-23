import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {TranslationService} from "./translation.service";

@Directive({
  selector: '[appTranslation]',
  standalone: true
})
export class TranslationDirective implements OnInit{

  @Input('translation') languageKey: string;

  constructor(private ele: ElementRef, private translation: TranslationService) { }

  ngOnInit() {
    this.translation.getTranslation(this.languageKey)
      .subscribe((translation) => {
        this.ele.nativeElement.innerText = translation;
    });
  }

}
