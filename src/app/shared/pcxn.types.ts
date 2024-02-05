import {ItemAnimationData} from "../section/custom-anim/custom-anim.component";

export type TranslationType = {
  translation: string;
} | {
  translatableKey: string;
}

export interface Translation {
  language: string,
  translation: string
}

export interface CategoryEntry {
  pcxnId: number,
  route: string,
  translationData: TranslationType,
  inNav?: boolean
}

export interface ModeEntry {
  pcxnKey: string,
  route: string,
  translationData: TranslationType
}

export interface ItemShortInfo {
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

export interface ItemExtendedInfo extends ItemShortInfo {
  description: ItemDescription,
  diagramData: DiagramData,
  lastUpdate: number,
  nookPrice?: number
}

export interface DiagramData {
  labels: string[],
  data: number[]
}

export interface UserShortInfo {
  name: string,
  userId: string,
}

export interface UserExtendedInfo extends UserShortInfo {

}

export interface ItemDescription {
  information?: string,
}


export type UserInfo = UserShortInfo | UserExtendedInfo;
export type ItemInfo = ItemShortInfo | ItemExtendedInfo;

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

