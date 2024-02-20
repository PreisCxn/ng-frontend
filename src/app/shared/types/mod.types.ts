/**
 * Minecraft Mod Einstellungen
 *
 * @property modName - Name der im Spiel angezeigt wird
 * @property minVersion - Minimale Version die benötigt wird als String z.B. "1.16.5"
 * @property languages - Sprachen die von Mod unterstützt werden
 * @property serverIps - Reihe an ServerIps, sodass Mod aktiviert wird
 * @property maintenance - Ob Mod in Wartung ist
 */
export type ModData = {
  modName: string;
  minVersion: string;
  languages: string[];
  serverIps: string[];
  maintenance: boolean;
}
