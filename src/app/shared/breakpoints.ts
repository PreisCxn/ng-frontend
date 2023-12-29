import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {map, Observable} from "rxjs";

export class BreakpointWidth {
  constructor(private width: string) {
  }

  public static maxWidth(value: number): BreakpointWidth {
    return new BreakpointWidth(`(max-width: ${value}px)`);
  }

  public static minWidth(value: number): BreakpointWidth {
    return new BreakpointWidth(`(min-width: ${value}px)`);
  }

  public static maxWidthAndMinWidth(max: number, min: number): BreakpointWidth {
    return new BreakpointWidth(`(min-width: ${min}px) and (max-width: ${max}px)`);
  }

  public getWidth(): string {
    return this.width;
  }

}

export class Breakpoints{

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

  private setup(breakpoints: {[key: string]: number | string}, defaultValue: number | string) {
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

  public initFlex(breakpoints: {[key: string]: number | string }, defaultValue: number | string) {
    this.setup(breakpoints, defaultValue);
    return this;
  }

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

  public getObserver(): Observable<any> {
    if(this.observer === undefined) throw new Error("Breakpoints not initialized");
    return this.observer;
  }


  public subscribe(callback: (result: any) => void) {
    this.getObserver().subscribe(callback);
  }

}
