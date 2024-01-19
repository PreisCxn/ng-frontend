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

  animationUrl: string,
  sellingUser?: string[],
  buyingUser?: string[],
}

export interface ItemDescription {
  descriptionTranslation: string
}

export interface ItemExtendedInfo extends ItemShortInfo {
  description: ItemDescription,
  lastUpdate: number,
  nookPrice?: number
}

