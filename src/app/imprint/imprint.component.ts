import {Component, OnInit} from '@angular/core';
import {HeaderService, MenuActives} from "../shared/header.service";
import {RedirectService} from "../shared/redirect.service";

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent implements OnInit{

  constructor(private headerService: HeaderService, private redirect: RedirectService) {

    this.headerService.init(
      "pcxn.subsite.imprint.sectionTitle",
      false,
      false,
      MenuActives.IMPRINT
    );
  }

  ngOnInit(): void {
    this.redirect.resetQueryParams();
  }

}
