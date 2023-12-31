import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {map, Observable} from "rxjs";

/**
 * Die Klasse BreakpointWidth stellt Methoden zur Verfügung,
 * um Breakpoints für verschiedene Bildschirmbreiten zu definieren.
 */
export class BreakpointWidth {
  constructor(private width: string) {
  }

  /**
   * Erstellt einen neuen Breakpoint für die maximale Bildschirmbreite.
   * @param value Die maximale Bildschirmbreite in Pixel.
   * @returns Eine neue Instanz von BreakpointWidth.
   */
  public static maxWidth(value: number): BreakpointWidth {
    return new BreakpointWidth(`(max-width: ${value}px)`);
  }

  /**
   * Erstellt einen neuen Breakpoint für die minimale Bildschirmbreite.
   * @param value Die minimale Bildschirmbreite in Pixel.
   * @returns Eine neue Instanz von BreakpointWidth.
   */
  public static minWidth(value: number): BreakpointWidth {
    return new BreakpointWidth(`(min-width: ${value}px)`);
  }


  /**
   * Erstellt einen neuen Breakpoint für einen Bereich von Bildschirmbreiten.
   * @param max Die maximale Bildschirmbreite in Pixel.
   * @param min Die minimale Bildschirmbreite in Pixel.
   * @returns Eine neue Instanz von BreakpointWidth.
   */
  public static maxWidthAndMinWidth(max: number, min: number): BreakpointWidth {
    return new BreakpointWidth(`(min-width: ${min}px) and (max-width: ${max}px)`);
  }

  /**
   * Erstellt ein neues Objekt, das die Breakpoints und ihre zugehörigen Werte definiert.
   * Wird verwendet, um ein Custom-Layout eines Breakpoints zu initialisieren.
   * @param pairs Ein Array von Paaren aus BreakpointWidth und Werten.
   * @returns Ein Objekt, das die Breakpoints und ihre zugehörigen Werte definiert.
   */
  static getBreakpointValues(pairs: [BreakpointWidth, number | string][]): {[key: string]: number | string} {
    let result: {[key: string]: number | string} = {};
    for (let pair of pairs) {
      result[pair[0].getWidth()] = pair[1];
    }
    return result;
  }

  /**
   * Gibt die Breite des Breakpoints zurück.
   * @returns Die Breite des Breakpoints als String.
   */
  public getWidth(): string {
    return this.width;
  }

}

/**
 * Die Klasse Breakpoints ermöglicht die Verwaltung von Breakpoints in einer Angular-Anwendung.
 * Sie stellt Methoden zur Verfügung, um Breakpoints zu definieren und zu beobachten.
 */
export class Breakpoints {

  /**
   * Ein Array von Standard-Breakpoints, die in der Anwendung verwendet werden.
   * Nur min-Werte werden verwendet (Mobile-First).
   */
  private static readonly standardBreakpoints: BreakpointWidth[] = [
    BreakpointWidth.minWidth(475),
    BreakpointWidth.minWidth(640),
    BreakpointWidth.minWidth(768),
    BreakpointWidth.minWidth(1024),
    BreakpointWidth.minWidth(1280),
    BreakpointWidth.minWidth(1536),
  ];

  private observer: Observable<any> | undefined;

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  /**
   * Setzt die Breakpoints und den Standardwert für das Layout.
   *
   * @param breakpoints Ein Objekt, das die Breakpoints und ihre zugehörigen Werte definiert.
   * @param defaultValue Der Standardwert, der verwendet wird, wenn kein Breakpoint zutrifft.
   */
  private setup(breakpoints: {[key: string]: number | string}, defaultValue: number | string) {
    if(Object.keys(breakpoints).length === 0) {
      this.observer = new Observable(subscriber => {
        subscriber.next(defaultValue);
      });
      return;
    }
    this.observer = this.breakpointObserver
      .observe(Object.keys(breakpoints))
      .pipe(
        map(result => {
          for (const query of Object.keys(result.breakpoints)) {
            if (result.breakpoints[query]) {
              return breakpoints[query];
            }
          }
          return defaultValue;
        })
      );
  }

  /**
   * Initialisiert Flex-Layout mit gegebenen Breakpoints und Standardwert.
   *
   * @param breakpoints Ein Objekt, das die Breakpoints und ihre zugehörigen Werte definiert.
   *                    Dieses Objekt sollte mit der Methode `BreakpointWidth.getBreakpointValues` erstellt werden.
   *                    Alternativ kann man auch die Methode `initFlex` verwenden.
   * @param defaultValue Der Standardwert, der verwendet wird, wenn kein Breakpoint zutrifft.
   * @returns Gibt die aktuelle Instanz von `Breakpoints` zurück, um Methodenketten zu ermöglichen.
   */
  public initCustom(breakpoints: {[key: string]: number | string }, defaultValue: number | string) {
    this.setup(breakpoints, defaultValue);
    return this;
  }

  /**
   * Initialisiert Flex-Layout mit gegebenen Breakpoints und Standardwert.
   *
   * @param breakpoints Ein Array von Paaren aus BreakpointWidth und Werten.
   * @param defaultValue Der Standardwert, der verwendet wird, wenn kein Breakpoint zutrifft.
   * @returns Gibt die aktuelle Instanz von `Breakpoints` zurück, um Methodenketten zu ermöglichen.
   */
  public initFlex(breakpoints: [BreakpointWidth, number | string][], defaultValue: number | string): Breakpoints {
    return this.initCustom(BreakpointWidth.getBreakpointValues(breakpoints), defaultValue);
  }

  /**
   * Initialisiert Flex-Layout mit Standard-Breakpoints und gegebenen Werten.
   *
   * @param values Ein Array von Werten, die den Standard-Breakpoints zugeordnet sind.
   * @param defaultValue Der Standardwert, der verwendet wird, wenn kein Breakpoint zutrifft.
   * @returns Gibt die aktuelle Instanz von `Breakpoints` zurück, um Methodenketten zu ermöglichen.
   * @throws Wenn die Anzahl der Werte nicht mit der Anzahl der Standard-Breakpoints übereinstimmt.
   */
  public initStandard(values: number[] | string[], defaultValue: number | string) {
    if (values.length !== Breakpoints.standardBreakpoints.length) {
      throw new Error('The number of values must match the number of standard breakpoints');
    }

    const breakpoints: {[key: string]: number | string} = {};
    for (let i = 0; i < Breakpoints.standardBreakpoints.length; i++) {
      breakpoints[Breakpoints.standardBreakpoints[i].getWidth()] = values[i];
    }

    this.setup(breakpoints, defaultValue);
    return this;
  }

  /**
   * Gibt das Observable zurück, das die aktuellen Breakpoint-Werte beobachtet.
   *
   * @returns Ein Observable, das die aktuellen Breakpoint-Werte beobachtet.
   */
  public getObserver(): Observable<any> {
    if(this.observer === undefined) throw new Error("Breakpoints not initialized");
    return this.observer;
  }

  /**
   * Abonniert das Observable, das die aktuellen Breakpoint-Werte beobachtet,
   * und führt eine Callback-Funktion aus, wenn sich die Werte ändern.
   *
   * @param callback Die Funktion, die ausgeführt wird, wenn sich die Breakpoint-Werte ändern.
   */
  public subscribe(callback: (result: any) => void) {
    this.getObserver().subscribe(callback);
  }
}
