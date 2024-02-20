import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {Modes} from "../../mode/shared/modes";
import {AdminNavService, AdminSubsites} from "../shared/admin-nav.service";
import {SellBuyReq} from "../../shared/types/item.types";

@Component({
  selector: 'app-sell-buy-req',
  standalone: true,
  imports: [
    NgClass,
    NgForOf
  ],
  templateUrl: './sell-buy-req.component.html',
  styleUrl: './sell-buy-req.component.scss'
})
export class SellBuyReqComponent implements OnInit{
  sellBuyReqs: SellBuyReq[] = [
    {
      id: 1,
      modeKey: Modes.SKYBLOCK,
      itemUrl: 'https://www.example.com/item1',
      isSelling: true,
      userName: 'Max Mustermann'
    },
    {
      id: 2,
      modeKey: Modes.SKYBLOCK,
      itemUrl: 'https://www.example.com/item2',
      isSelling: true,
      userName: 'Max 213312'
    },
  ];

  constructor(private nav: AdminNavService) { }

  ngOnInit() {
    this.nav.setActiveSubsite(AdminSubsites.SELL_BUY_REQ);
  }

  acceptReq(index: number) {
    // Fügen Sie hier Ihre Logik zum Akzeptieren eines SellBuyReq hinzu
    console.log(`SellBuyReq ${index} accepted`);
  }

  declineReq(index: number) {
    // Fügen Sie hier Ihre Logik zum Ablehnen eines SellBuyReq hinzu
    console.log(`SellBuyReq ${index} declined`);
  }

  protected readonly Modes = Modes;
}
