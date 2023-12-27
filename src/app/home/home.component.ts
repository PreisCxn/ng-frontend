import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../shared/header.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(private headerService: HeaderService) {
    this.headerService.setSectionTitleByLanguageKey("pcxn.section.home.sectionTitle");
  }

  ngOnInit() {
  }

}
