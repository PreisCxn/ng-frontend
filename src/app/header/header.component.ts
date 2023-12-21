import {Component, OnInit} from '@angular/core';
import {HeaderService} from "../shared/header.service";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  darkMode:boolean = true;

  constructor(public headerService: HeaderService) {
  }

  toggleMode(): void {
    this.darkMode = !this.darkMode;
  }

}
