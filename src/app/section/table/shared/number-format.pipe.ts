import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {

  static format(value1: number, value2: number, abbreviate: boolean = false): string {
    const pipe = new NumberFormatPipe();
    const pipe2 = new NumberFormatPipe();
    return pipe.transform(value1, abbreviate) + " - " + pipe2.transform(value2, abbreviate);
  }

  transform(value: number, abbreviate: boolean = false): string {

    let suffix = '';

    let fractionDigits = 2;

    if (abbreviate) {
      if (value >= 1000000) {
        suffix = ' Mio';
        value /= 1000000;
        const decimal = value % 1;
        fractionDigits = decimal > 0.3 && decimal < 0.7 ? 1 : 0;
        if(decimal > 0.7) value += 1;
      } else if (value >= 10000) {
        fractionDigits = 1;
        suffix = ' k';
        value /= 1000;
        const decimal = value % 1;
        fractionDigits = decimal > 0.3 && decimal < 0.7 ? 1 : 0;
        if(decimal > 0.7) value += 1;
      }
    }


    return value.toLocaleString('de-DE', { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }) + suffix;

  }

}
