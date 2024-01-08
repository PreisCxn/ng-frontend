import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService, MenuActives} from "../shared/header.service";
import {HeroModule} from "../section/hero/hero.module";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private headerService: HeaderService) {

    this.headerService.init(
      "pcxn.subsite.home.sectionTitle",
      false,
      false,
      MenuActives.HOME);

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

}
