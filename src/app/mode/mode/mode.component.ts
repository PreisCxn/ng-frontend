import {Component, OnInit} from '@angular/core';
import {ModeService} from "../shared/mode.service";
import {ActivatedRoute} from "@angular/router";
import {HeaderService} from "../../shared/header.service";
import {Optional} from "../../shared/optional";

@Component({
  selector: 'app-mode',
  standalone: true,
  imports: [],
  templateUrl: './mode.component.html',
  styleUrl: './mode.component.scss'
})
export class ModeComponent implements OnInit{

  private modeKey: Optional<string> = Optional.empty();

  constructor(private modeService: ModeService, route: ActivatedRoute, private headerService: HeaderService){
    modeService.setActivatedRoute(route);
    this.modeKey = this.modeService.getMode();
    this.modeKey.ifPresent(key => {
      this.headerService.setSectionTitleByLanguageKey(`pcxn.subsite.${key}.sectionTitle`);
    });
  }

  ngOnInit(): void {
  }


}
