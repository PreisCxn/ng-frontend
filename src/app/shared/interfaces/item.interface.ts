import {ItemData, ItemExtendedInfo, ItemReport, ItemShortInfo, SellBuyReq} from "../types/item.types";

export interface IItemCommunication {

  getItemData(): ItemData[];

  saveItemData(data: Partial<ItemData>): ItemData;

  getItemReports(): ItemReport[];

  getItemShortInfo(): ItemShortInfo[];

  getItemExtendedInfo(): ItemExtendedInfo[];

  getSellBuyRequests(): SellBuyReq[];

  declineSellBuyRequest(requestId: string): boolean;

  acceptSellBuyRequest(requestId: string): boolean;

}
