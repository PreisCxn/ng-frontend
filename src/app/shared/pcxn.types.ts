export type TranslationType = {
  translation: string;
} | {
  translatableKey: string;
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
  modeKey: string,
  id: string,
  imageUrl: string,
  translation: string;
  categories: number[],
  perPrice: number,
  lastUpdated: number,

  sellingUser: string[],
  buyingUser: string[]
}

export interface ItemDescription {
  descriptionTranslation: string,
  nookPrice?: number,
}

export interface ItemExtendedInfo extends ItemShortInfo {
  description: ItemDescription
}

