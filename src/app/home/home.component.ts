import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService, MenuActives} from "../shared/header.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private headerService: HeaderService) {
    this.headerService.setSectionTitleByLanguageKey("pcxn.subsite.home.sectionTitle")
    this.headerService.setActiveMenuItem(MenuActives.HOME);
    this.headerService.setActivatedCategory(false);
    this.headerService.showSearch = false;
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

}
