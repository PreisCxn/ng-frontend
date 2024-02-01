import {Component, OnInit} from '@angular/core';
import {ModeService} from "../shared/mode.service";
import {ActivatedRoute} from "@angular/router";
import {HeaderService, MenuActives} from "../../shared/header.service";
import {ChartComponent} from "../../section/chart/chart.component";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    ChartComponent
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit{

  constructor(
    private modeService: ModeService,
    route: ActivatedRoute,
    private headerService: HeaderService,
  ) {
    modeService.setActivatedRoute(route, () => {});
  }
  ngOnInit(): void {

    this.headerService.init(
      ModeService.itemId.orElse(""),
      false,
      false,
      ModeService.mode.orElse("") as MenuActives);

  }

}
