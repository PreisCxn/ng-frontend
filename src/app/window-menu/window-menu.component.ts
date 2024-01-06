import { Component } from '@angular/core';
import {ThemeService} from "../shared/theme.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-window-menu',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './window-menu.component.html',
  styleUrl: './window-menu.component.scss'
})
export class WindowMenuComponent {

  constructor(public theme: ThemeService) {
  }

}
