import {Component} from '@angular/core';
import {AdminItemDataComponent} from "../../components/item/adminItemData.component";
import {AdminNavService, AdminSubsites} from "../../shared/admin-nav.service";

@Component({
  selector: 'app-all-items',
  standalone: true,
  imports: [
    AdminItemDataComponent
  ],
  templateUrl: './all-items.component.html',
  styleUrl: './all-items.component.scss'
})
export class AllItemsComponent {

  constructor(private nav: AdminNavService) {
    this.nav.setActiveSubsite(AdminSubsites.ALL_ITEMS);

  }


}
