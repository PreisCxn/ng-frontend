import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {

  //abreviate = true -> 1.000.000 -> 1 Mio usw.
  static format(value1: number, value2: number, abbreviate: boolean = false): string {
    const pipe = new NumberFormatPipe();
    const pipe2 = new NumberFormatPipe();
    return pipe.transform(value1, abbreviate) + " - " + pipe2.transform(value2, abbreviate);
  }

  static formatSingle(value: number, abbreviate: boolean = false): string {
    const pipe = new NumberFormatPipe();
    return pipe.transform(value, abbreviate);
  }

  transform(value: number, abbreviate: boolean = false): string {

    let suffix = '';

    let fractionDigits = 2;

    if (abbreviate) {
      //wenn value > 1.000.000 dann Mio abkürzen
      if (value >= 1000000) {
        suffix = ' Mio';
        value /= 1000000;
        const decimal = value % 1;
        //wenn decimal zwischen 0.3 und 0.7 dann 1 Nachkommastelle sonst keine
        fractionDigits = decimal > 0.3 && decimal < 0.7 ? 1 : 0;
      } else if (value >= 10000) {
        //wenn value > 10.000 dann k abkürzen
        fractionDigits = 1;
        suffix = ' k';
        value /= 1000;
        const decimal = value % 1;
        //wenn decimal zwischen 0.3 und 0.7 dann 1 Nachkommastelle sonst keine
        fractionDigits = decimal > 0.3 && decimal < 0.7 ? 1 : 0;
        if(decimal > 0.7) value += 1;
      }
    }


    //ansonsten ganz normal formatieren mit 2 Nachkommastellen
    return value.toLocaleString('de-DE', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    }) + suffix;

  }

}
