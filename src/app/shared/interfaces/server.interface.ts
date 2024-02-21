export interface IServerCommunication {
  /**
   * Prüft ob der Server im Wartungsmodus ist
   *
   * - get: /web/maintenance
   *
   */
  isWebMaintenance(): Promise<boolean>;

  /**
   * Setzt den Server in den Wartungsmodus
   *
   * - post: /web/maintenance
   *
   */
  goWebOnline(): Promise<boolean>;

  /**
   * Setzt den Server aus dem Wartungsmodus
   *
   * - delete: /web/maintenance
   *
   */
  goWebOffline(): Promise<boolean>;

}
