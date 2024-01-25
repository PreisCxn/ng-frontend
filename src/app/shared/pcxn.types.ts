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
  sellingUser?: string[],
  buyingUser?: string[],
}

export interface ItemDescription {
  descriptionTranslation: string
}

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

export interface ItemExtendedInfo extends ItemShortInfo {
  description: ItemDescription,
  lastUpdate: number,
  nookPrice?: number
}

