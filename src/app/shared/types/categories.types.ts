import {Translation, TranslationType} from "./translation.types";


/**
 * Kategorie Eintrag für Items
 * @property pcxnId - eindeutige Id der Kategorie
 * @property route - Pfad der Kategorie (z.B. /items) um die Kategorie auszuwählen
 * @property translationData - Übersetzungsdaten
 * @property inNav? - Ob Kategorie in der Navigationsleiste angezeigt wird
 */
export type Category = {
  pcxnId: number,
  route: string,
  translationData: Translation[],
  inNav?: boolean
}
/**
 * Kategorie Eintrag für Items
 * @property pcxnId - eindeutige Id der Kategorie
 * @property route - Pfad der Kategorie (z.B. /items) um die Kategorie auszuwählen
 * @property translationData - Übersetzungsdaten
 * @property inNav? - Ob Kategorie in der Navigationsleiste angezeigt wird
 */
export type CategoryEntry = Omit<Category, "translationData"> & {
  translationData: TranslationType
  multiplier?: number
}
/**
 * Kategorie Eintrag Erstellung
 * @property route - Pfad der Kategorie (z.B. /items) um die Kategorie auszuwählen
 * @property translationData - Übersetzungsdaten
 * @property inNav? - Ob Kategorie in der Navigationsleiste angezeigt wird
 */
export type CategoryCreation = Omit<Category, "pcxnId" | "route">
