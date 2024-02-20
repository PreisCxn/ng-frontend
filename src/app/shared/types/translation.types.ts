export type TranslationType = {
  translation: string;
} | {
  translatableKey: string;
}

export type Translation = {
  language: string,
  translation: string
}
