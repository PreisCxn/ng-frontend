import { Component } from '@angular/core';
import {TranslationDirective} from "../shared/translation.directive";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    TranslationDirective
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
