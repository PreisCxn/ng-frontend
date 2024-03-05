import { Injectable } from '@angular/core';
import {AdminModule} from "../admin.module";

export enum AdminSubsites {
  HOME = 'home',
  MOD_SETTINGS = 'mod-settings',
  CATEGORY_SETTINGS = 'category-settings',
  SELL_BUY_REQ = 'sell-buy-req',
  ALL_ITEMS = 'item/all',
  BLOCKED_ITEMS = 'item/blocked',
  NEW_ITEMS = 'item/new',
  ITEM_CONNECTIONS = 'item/connections',
  ITEM_REPORTS = 'item/reports',
  ITEM = 'item/id'
}

@Injectable({
  providedIn: AdminModule
})
export class AdminNavService {

  activeSubsite: AdminSubsites = AdminSubsites.HOME;

  constructor() {

  }

  setActiveSubsite(subsite: AdminSubsites) {
    this.activeSubsite = subsite;
  }
}
