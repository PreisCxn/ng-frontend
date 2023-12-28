import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../shared/header.service";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit{

  constructor(private headerService: HeaderService) {
    this.headerService.setSectionTitleByLanguageKey("pcxn.subsite.notFound.sectionTitle");
  }

  ngOnInit(): void {
  }

}
