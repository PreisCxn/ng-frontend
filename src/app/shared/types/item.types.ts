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
export type ItemData = ItemExtendedInfo & {
  retention: ItemRetention,
  isInfluenced: boolean,
  modes: string[],
}

/**
 * Änderungen an einem Item
 */
export type ItemChanges = Partial<Omit<ItemData, "nookPrice" | "lastUpdate" | "diagramData" | "minPrice" | "maxPrice" | "modeKey" | "pcxnId">> & {
  pcxnId: number,
}

/**
 * Item Einstellungen für Preisänderungen
 */
export type ItemRetention = {
  modeKey: string,
  minPrice: number,
  maxPrice: number,
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
  pcxnId: number,
  modeKey: string,
  minPrice: number,
  maxPrice: number,
  timestamp: number,
}

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

