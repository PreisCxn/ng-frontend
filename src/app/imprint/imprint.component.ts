import { Component } from '@angular/core';
import {HeaderService, MenuActives} from "../shared/header.service";

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

  constructor(private headerService: HeaderService) {

    this.headerService.init(
      "pcxn.subsite.imprint.sectionTitle",
      false,
      false,
      MenuActives.IMPRINT
    );
  }

}
