import {Component, OnInit} from '@angular/core';
import {ModeService} from "../shared/mode.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit{

  constructor(private modeService: ModeService, route: ActivatedRoute) {
    modeService.setActivatedRoute(route, () => {});
  }
  ngOnInit(): void {

    console.log('mode:' + this.modeService.getMode().orElse("null"));
    console.log('itemId:' + this.modeService.getItemId().orElse("null"));
  }

}
