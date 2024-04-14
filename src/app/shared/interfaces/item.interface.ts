import {
  ItemChanges,
  ItemData,
  ItemExtendedInfo,
  ItemReport,
  ItemShortInfo,
  SellBuyReq,
  SellBuyReqCreation
} from "../types/item.types";
import {Modes} from "../../mode/shared/modes";

export interface IItemCommunication {

  /**
   * Fragt alle ItemDaten vom Backend ab
   *
   * - get: /web/item/data
   *
   */
  getItemData(): Promise<ItemData[]>;

  /**
   * Fragt alle ItemDaten vom Backend ab
   *
   * @param data
   *
   * - post: /web/item/data
   *
   */
  saveItemData(data: ItemChanges): Promise<ItemData>;

  /**
   * Fragt alle ItemReports vom Backend ab
   *
   * - get: /web/item/reports
   *
   */
  getItemReports(): Promise<ItemReport[]>;

  /**
   * Fragt alle ItemShortInfos vom Backend ab
   *
   * - get: /web/item/short
   *
   */
  getItemShortInfo(mode: Modes): Promise<ItemShortInfo[]>;

  /**
   * Fragt alle ItemExtendedInfos vom Backend ab
   *
   * - get: /web/item/extended
   *
   */
  getItemExtendedInfo(itemId: string, mode: Modes): Promise<ItemExtendedInfo>;

  /**
   * Fragt alle SellBuyRequests vom Backend ab
   *
   * - get: /web/item/sellBuyRequest
   *
   */
  getSellBuyRequests(): Promise<SellBuyReq[]>;

  /**
   * Declines a sell buy request
   *
   * @param requestId
   *
   * - delete: /web/item/sellBuyRequest/:id
   *
   */
  declineSellBuyRequest(requestId: string): Promise<boolean>;

  /**
   * Accepts a sell buy request
   *
   * @param requestId
   *
   * - post: /web/item/sellBuyRequest/:id
   *
   */
  acceptSellBuyRequest(requestId: string): Promise<boolean>;

  createSellBuyRequest(req: SellBuyReqCreation): Promise<SellBuyReq>;

}
