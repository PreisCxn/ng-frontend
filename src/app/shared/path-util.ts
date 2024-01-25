export class PathUtil {
  /**
   * Gibt den Verzeichnispfad einer Datei zurück.
   * @param filePath - Der vollständige Pfad der Datei.
   * @returns Der Verzeichnispfad der Datei.
   */
  static getDirectory(filePath: string): string {
    const lastSlashIndex = filePath.lastIndexOf('/');
    return filePath.substring(0, lastSlashIndex);
  }

  static printCurrentDir(): void {
    console.log("Current directory: " + __dirname);

  }
}
