import {Component, OnInit} from '@angular/core';
import {ModeService} from "../shared/mode.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-mode',
  standalone: true,
  imports: [],
  templateUrl: './mode.component.html',
  styleUrl: './mode.component.scss'
})
export class ModeComponent implements OnInit{

  constructor(private modeService: ModeService, route: ActivatedRoute) {
    modeService.setActivatedRoute(route);
  }

  ngOnInit(): void {
    console.log('mode:' + this.modeService.getMode().get());
    console.log('itemId:' + this.modeService.getItemId().get());
  }


}
