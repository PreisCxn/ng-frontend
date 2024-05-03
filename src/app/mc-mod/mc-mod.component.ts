import {Component, OnInit} from '@angular/core';
import {HeaderService, MenuActives} from "../shared/header.service";
import {RedirectService} from "../shared/redirect.service";

@Component({
  selector: 'app-mc-mod',
  standalone: true,
  imports: [],
  templateUrl: './mc-mod.component.html',
  styleUrl: './mc-mod.component.scss'
})
export class McModComponent implements OnInit {

  constructor(private headerService: HeaderService, protected redirect: RedirectService) {
    this.headerService.init(
      "pcxn.subsite.mod.sectionTitle",
      false,
      false,
      MenuActives.MOD
    );
  }

  ngOnInit(): void {
    this.redirect.resetQueryParams();
    this.redirect.scrollToTop(false);
  }

}
