import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from "../shared/header.service";
import {Subscription} from "rxjs";
import {Optional} from "../shared/optional";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private headerService: HeaderService) {}

  ngOnInit() {
    this.headerService.setSectionTitleByLanguageKey("pcxn.subsite.home.sectionTitle");
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy");
  }

}
