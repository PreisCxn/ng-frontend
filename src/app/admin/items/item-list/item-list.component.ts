import {Component, OnInit} from "@angular/core";
import {AdminService} from "../../shared/admin.service";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ItemSearchPipe} from "../../shared/item-search.pipe";
import {Optional} from "../../../shared/optional";
import {ItemData} from "../../../shared/types/item.types";
import {AdminNotifyService, AlertType} from "../../shared/admin-notify.service";
import {AdminNavService, AdminSubsites} from "../../shared/admin-nav.service";

@Component({
  selector: 'app-item-list',
  standalone: true,
  templateUrl: './item-list.component.html',
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    FormsModule,
    ItemSearchPipe
  ],
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent implements OnInit{

  searchText: string = "";

  blocked: boolean = false;
  newItems: boolean = false;
  connections: boolean = false;
  allItems: boolean = false;

  constructor(protected admin: AdminService, private route: ActivatedRoute, private notify: AdminNotifyService, private nav: AdminNavService, private router: Router) { }

  ngOnInit() {

    this.route.snapshot.queryParams['search'] ? this.searchText = this.route.snapshot.queryParams['search'] : this.searchText = "";

    this.route.data.subscribe(data => {
      this.blocked = data['blocked'];
      this.newItems = data['newItems'];
      this.connections = data['connections'];
      this.allItems = data['allItems'];

      if(this.blocked) {
        this.nav.setActiveSubsite(AdminSubsites.BLOCKED_ITEMS);
      }
      if(this.newItems) {
        this.nav.setActiveSubsite(AdminSubsites.NEW_ITEMS);
      }
      if(this.connections) {
        this.nav.setActiveSubsite(AdminSubsites.ITEM_CONNECTIONS);
      }
      if(this.allItems) {
        this.nav.setActiveSubsite(AdminSubsites.ALL_ITEMS);
      }


    });

  }

  getItems(): Optional<ItemData[]> {
    if(this.blocked) {
      return this.admin.BLOCKED_ITEMS;
    }
    if(this.newItems) {
      return this.admin.NEW_ITEMS;
    }
    if(this.connections) {
      return this.admin.ITEM_CONNECTIONS;
    }
    if(this.allItems) {
      return this.admin.ALL_ITEMS;
    }
    return Optional.empty();
  }

  refresh() {
    window.location.reload();
  }

  blockItem(item: ItemData) {
    if(!item.pcxnId) return;


    this.admin.blockItem(item.pcxnId, !item.blocked).then(() => {
      this.notify.notify(AlertType.SUCCESS, "Item " + item.pcxnId + " " + (item.blocked ? 'unblocked': 'blocked') + " successfully");
      this.admin.getItemData().then(() => {});
    }).catch(e => {
      this.notify.notify(AlertType.DANGER, "Failed to block item " + item.pcxnId + " due to " + e)
    });
  }

  getFirstMode(item: ItemData) {
    const data = this.admin.getFoundModesArr(item);
    return data.isPresent() ? data.get()[0] : undefined;
  }

  protected onSearchChange() {
    this.router.navigate([], {
      queryParams: {
        search: this.searchText === "" ? null : this.searchText,
      },
      replaceUrl: true
    }).then(r => {});
  }

  protected hasCountModes(item: ItemData): boolean {
    return item.count !== undefined && item.count.length > 0;
  }

  protected getCountModes(item: ItemData): string {
    return item.count?.map(c => `${c.mode}:${c.count}`).join(", ") || "";
  }

}
