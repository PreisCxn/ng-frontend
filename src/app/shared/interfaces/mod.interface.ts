import {ModData} from "../types/mod.types";

export interface IModCommunication {

  /**
   * Fragt alle ModDaten vom Backend ab
   *
   * - get: /web/mod/data
   *
   */
  getModData(): Promise<ModData>;

  /**
   * Sendet alle ModDaten an das Backend und speichert sie, gibt neue ModDaten zurück
   *
   * - post: /web/mod/data
   *
   */
  saveModData(data: Partial<ModData>): Promise<ModData>;

  /**
   * Setzt die Mod in den Maintenance Modus, gibt status zurück
   *
   * - post: /web/mod/maintenance
   *
   */
  goModOnline(): Promise<ModData>;

  /**
   * Setzt die Mod in den Maintenance Modus, gibt status zurück
   *
   * - delete: /web/mod/maintenance
   *
   */
  goModOffline(): Promise<ModData>;

}
