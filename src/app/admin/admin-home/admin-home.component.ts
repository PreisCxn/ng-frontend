import {Component, OnInit} from '@angular/core';
import {AdminNavService, AdminSubsites} from "../shared/admin-nav.service";

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent implements OnInit{

  constructor(private nav: AdminNavService) {
  }

  ngOnInit(): void {
    this.nav.setActiveSubsite(AdminSubsites.HOME);
  }

}
