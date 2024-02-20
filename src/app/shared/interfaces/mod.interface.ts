import {ModData} from "../types/mod.types";

export interface IModCommunication {

  /**
   * Fragt alle ModDaten vom Backend ab
   */
  getModData(): ModData;

  /**
   * Sendet alle ModDaten an das Backend und speichert sie, gibt neue ModDaten zurück
   */
  saveModData(data: Partial<ModData>): ModData;

  /**
   * Setzt die Mod in den Maintenance Modus, gibt status zurück
   */
  goModOnline(): ModData;

  /**
   * Setzt die Mod in den Maintenance Modus, gibt status zurück
   */
  goModOffline(): ModData;

}
