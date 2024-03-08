import {Translation} from "./translation.types";
import {UserShortInfo} from "./user.types";
import {ItemAnimationData} from "../../section/custom-anim/custom-anim.component";

/**
 * ItemInfo für die Anzeige in der Tabelle
 */
export type ItemShortInfo = {
  pcxnId?: number,
  modeKey?: string,
  itemUrl: string,
  imageUrl: string,

  translation: Translation[],
  minPrice: number,
  maxPrice: number,
  categoryIds: number[],

  animationData?: ItemAnimationData[],
  sellingUser?: UserShortInfo[],
  buyingUser?: UserShortInfo[],
}

/**
 * ItemInfo für die Anzeige auf der Detailseite
 */
export type ItemExtendedInfo =  ItemShortInfo & {
  description: ItemDescription,
  diagramData: DiagramData,
  lastUpdate: number,
  nookPrice?: number
}

export type ItemInfo = ItemShortInfo | ItemExtendedInfo;

/**
 * ItemInfo für die Einstellungen
 */
export type ItemData =
  Omit<ItemExtendedInfo, "pcxnId" | "modeKey" | "minPrice" | "maxPrice" | "sellingUser" | "buyingUser" | "diagramData" | "lastUpdate" | "nookPrice">
  & {
  pcxnId: number,
  setup: boolean,
  blocked: boolean,
  connection: number,
  pcxnSearchKey: string,
  pbvSearchKey: string,
  modes: {
    modeKey: string,
    minPrice: number,
    maxPrice: number,
    retention?: ItemRetention,
    sellingUser: UserShortInfo[],
    buyingUser: UserShortInfo[],
  }[],
}
/**
 * Änderungen an einem Item
 */
export type ItemChanges =
  Partial<Omit<ItemData, "modes" | "pcxnSearchKey" | "pbvSearchKey" | "connection">>
  & {
  pcxnId: number,
  connection?: number,
  modes?: {
    modeKey: string,
    retention: ItemRetention | null,
  }[]
}


/**
 * Item Einstellungen für Preisänderungen
 */
export type ItemRetention = {
  modeKey: string,
  minPrice: number,
  maxPrice: number,
  retentionPercentage?: number,
  fadeOut: number,
}

/**
 * Daten für das Diagramm auf der Detailseite
 */
export type DiagramData = {
  labels: string[],
  data: number[]
}

/**
 * Item Beschreibung
 */
export type ItemDescription = {
  information?: Translation[]
}

/**
 * Report für eine Preisänderung
 */
export type ItemReport = {
  id: number,
  itemId: number,
  itemRoute: string,
  modeKey: string,
  minPrice: number,
  maxPrice: number,
  timestamp: number,
}
export type ItemReportCreation = Omit<ItemReport, "id" | "timestamp"> & {
  timestamp?: number,
};

/**
 * Anfrage zum Kaufen oder Verkaufen eines Items
 */
export type SellBuyReq = {
  id: number,
  modeKey: string,
  itemUrl: string,
  isSelling?: boolean,
  isBuying?: boolean,
  userName: string,
}

export function isItemInfo(item: any): item is ItemInfo {
  return item
    && typeof item === 'object'
    && 'itemUrl' in item
    && 'imageUrl' in item
    && 'translation' in item
    && 'minPrice' in item
    && 'maxPrice' in item
    && 'categoryIds' in item;
}

export function isItemExtendedInfo(item: any): item is ItemExtendedInfo {
  return isItemInfo(item)
    && 'description' in item
    && 'lastUpdate' in item
    && 'diagramData' in item;
}

export function isItemShortInfo(item: any): item is ItemShortInfo {
  return isItemInfo(item) && !isItemExtendedInfo(item);
}


