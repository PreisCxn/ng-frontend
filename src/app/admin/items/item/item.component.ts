import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AdminService} from "../../shared/admin.service";
import {ItemData} from "../../../shared/types/item.types";
import {AdminItemDataComponent} from "../../components/item/adminItemData.component";
import {AdminNavService, AdminSubsites} from "../../shared/admin-nav.service";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    ItemComponent,
    ItemComponent,
    ItemComponent,
    ItemComponent,
    AdminItemDataComponent
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit{

  itemData: ItemData | undefined;

  constructor(private route: ActivatedRoute, private adminService: AdminService, private nav: AdminNavService) { }

  ngOnInit() {
    this.nav.setActiveSubsite(AdminSubsites.ITEM);
    this.route.paramMap.subscribe(params => {
      const itemId = params.get('itemId');
      console.log(itemId);
      if(!itemId) return;
      if(isNaN(Number(itemId))) return;
      this.itemData = this.adminService.ITEM_DATA.orElse([]).find(item => item.pcxnId === Number(itemId));
    });
  }

}
