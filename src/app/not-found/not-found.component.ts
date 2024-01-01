import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../shared/header.service";
import {TranslationDirective} from "../shared/translation.directive";
import {TranslationService} from "../shared/translation.service";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    TranslationDirective
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit {

  constructor(private headerService: HeaderService, private translation: TranslationService) {
    this.headerService.setSectionTitleByLanguageKey("pcxn.subsite.notFound.sectionTitle");
  }

  ngOnInit(): void {
    console.log(
    this.translation.getTranslation("pcxn.subsite.notFound.description")
    );
  }

}
