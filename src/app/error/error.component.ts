import {Component, OnInit} from '@angular/core';
import {HeaderService, MenuActives} from "../shared/header.service";
import {TranslationDirective} from "../shared/translation.directive";
import {TranslationService} from "../shared/translation.service";
import {ActivatedRoute} from "@angular/router";
import {Optional} from "../shared/optional";

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [
    TranslationDirective
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent implements OnInit {

  public errorCode: Optional<string> = Optional.empty();
  public titleKey: Optional<string> = Optional.empty();
  public descriptionKey: Optional<string> = Optional.empty();
  public sectionTitleKey: Optional<string> = Optional.empty();

  constructor(private headerService: HeaderService, public translation: TranslationService, private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.errorCode = Optional.of(this.route.snapshot.data['errorCode']);
    this.titleKey = Optional.of(this.route.snapshot.data['titleKey']);
    this.descriptionKey = Optional.of(this.route.snapshot.data['descriptionKey']);
    this.sectionTitleKey = Optional.of(this.route.snapshot.data['sectionTitleKey']);

    this.sectionTitleKey.ifPresent(key => {
      this.headerService.init(
        key,
        false,
        false);
    })
  }

  getTitleKey(): string {
    if(this.titleKey.isEmpty()) {
      return '';
    }

    return this.titleKey.get();
  }

  protected readonly Optional = Optional;
}
