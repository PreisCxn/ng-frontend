import { Injectable } from '@angular/core';
import {ModeService} from "../../mode/shared/mode.service";
import {Languages} from "../../shared/languages";
import {ItemRetention, ItemShortInfo, Translation} from "../../shared/pcxn.types";

export interface ItemInfoSettings {
  pcxnId: number,
  itemInfo: ItemShortInfo[],
  itemDescription: Translation[],
  itemRetention: ItemRetention[],
}

export interface BuySellReq {
  pcxnId: number,
  modeKey: string,
  itemUrl: string,
  isSelling?: boolean,
  isBuying?: boolean,
  userName: string,
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private mode: ModeService) { }

  getCategories(language: Languages) {
    return this.mode.getCategories(language);
  }
}
