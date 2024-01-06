import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ModeService} from "../shared/mode.service";
import {ActivatedRoute} from "@angular/router";
import {HeaderService, MenuActives} from "../../shared/header.service";
import {Optional} from "../../shared/optional";
import {Modes} from "../shared/modes";

@Component({
  selector: 'app-mode',
  standalone: true,
  imports: [],
  templateUrl: './mode.component.html',
  styleUrl: './mode.component.scss'
})
export class ModeComponent implements OnInit, AfterViewInit{

  private modeKey: Optional<string> = Optional.empty();

  constructor(private modeService: ModeService,private route: ActivatedRoute, private headerService: HeaderService){ }

  private onModeUpdate(mode: Optional<string>, itemId: Optional<string>): void {
    mode.ifPresent(key => {
      this.modeKey = Optional.of(key);
      this.headerService.setSectionTitleByLanguageKey(`pcxn.subsite.${key}.sectionTitle`);
      this.headerService.setActiveMenuItem(key as MenuActives);
      this.headerService.resetSearchInput();
    });
  }

  ngOnInit(): void {
    this.headerService.showSearch = true;
    this.headerService.setActivatedCategory(true);
  }

  ngAfterViewInit(): void {
    this.modeService.setActivatedRoute(this.route, this.onModeUpdate.bind(this));
    this.modeKey = this.modeService.mode;
  }


}
