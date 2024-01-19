import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemHeaderComponent} from "./item-header/item-header.component";
import {ItemRowComponent} from "./item-row/item-row.component";
import {ItemTableComponent} from "./item-table/item-table.component";
import {SellerTableComponent} from "./seller-table/seller-table.component";
import {NumberFormatPipe} from "./shared/number-format.pipe";



@NgModule({
  declarations: [
    ItemHeaderComponent,
    ItemRowComponent,
    ItemTableComponent,
    SellerTableComponent
  ],
    imports: [
        CommonModule,
        NumberFormatPipe
    ],
  exports: [
    ItemTableComponent,
    SellerTableComponent
  ]
})
export class TableModule { }
