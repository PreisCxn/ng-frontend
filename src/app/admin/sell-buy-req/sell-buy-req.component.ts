import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Modes} from "../../mode/shared/modes";
import {AdminNavService, AdminSubsites} from "../shared/admin-nav.service";
import {SellBuyReq} from "../../shared/types/item.types";
import {AdminService} from "../shared/admin.service";
import {AdminNotifyService, AlertType} from "../shared/admin-notify.service";
import {DataService} from "../../shared/data.service";

@Component({
  selector: 'app-sell-buy-req',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './sell-buy-req.component.html',
  styleUrl: './sell-buy-req.component.scss'
})
export class SellBuyReqComponent implements OnInit {
  sellBuyReqs: SellBuyReq[] = this.admin.SELL_BUY_REQUESTS.orElse([]);

  constructor(private nav: AdminNavService, private admin: AdminService, private notify: AdminNotifyService, private data: DataService) {
  }

  ngOnInit() {
    this.nav.setActiveSubsite(AdminSubsites.SELL_BUY_REQ);
    this.admin.getSellBuyRequests().then(reqs => {
      this.sellBuyReqs = reqs;
    });
  }

  acceptReq(index: number) {

    this.admin.acceptSellBuyRequest(this.sellBuyReqs[index].id)
      .then(() => {
        this.notify.notify(AlertType.SUCCESS, 'SellBuyReq accepted');
      }).catch(e => {
      this.notify.notify(AlertType.DANGER, e.error || e.message);
    });

  }

  declineReq(index: number) {

    this.admin.declineSellBuyRequest(this.sellBuyReqs[index].id)
      .then(() => {
        this.notify.notify(AlertType.SUCCESS, 'SellBuyReq declined');
      }).catch(e => {
      this.notify.notify(AlertType.DANGER, e.error || e.message);
    });
  }

  protected reload() {
    window.location.reload();
  }

  protected readonly Modes = Modes;
}
