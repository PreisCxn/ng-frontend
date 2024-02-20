export interface IServerCommunication {
  /**
   * Prüft ob der Server im Wartungsmodus ist
   */
  isWebMaintenance(): boolean;

  /**
   * Setzt den Server in den Wartungsmodus
   *
   */
  goWebOnline(): boolean;

  /**
   * Setzt den Server aus dem Wartungsmodus
   */
  goWebOffline(): boolean;

}
