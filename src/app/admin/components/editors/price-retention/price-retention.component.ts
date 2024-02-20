import {Component, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {NgbModal, NgbTooltip, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {ItemShortInfo} from "../../../../shared/pcxn.types";

@Component({
  selector: 'app-price-retention',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    FormsModule,
    NgTemplateOutlet,
    NgClass,
    NgbTooltipModule
  ],
  templateUrl: './price-retention.component.html',
  styleUrl: './price-retention.component.scss'
})
export class PriceRetentionComponent {
  @ViewChild('content') content: any;
  @Input() items: ItemShortInfo[] = [
    {
    modeKey: 'citybuild',
    itemUrl: '',
    imageUrl: '',
    translation: [],
    minPrice: 0,
    maxPrice: 0,
    categoryIds: []
  },
    {
      modeKey: 'skyblock',
      itemUrl: '',
      imageUrl: '',
      translation: [],
      minPrice: 0,
      maxPrice: 0,
      categoryIds: []
    }];

  modeKey: string = '';
  minPrice: number = 0;
  maxPrice: number = 0;
  fadeOut: number = 0;
  editIndex: number | null = null;

  constructor(private modalService: NgbModal) {
  }

  editPriceRetention(index: number) {
    this.editIndex = index;

    this.open();
  }

  deleteMode(index: number) {

  }

  open() {
    this.modalService.open(this.content)
  }

  reload() {
    // Implement your reload logic here
  }

  saveMode() {
    this.modalService.dismissAll();
  }

  openPriceChangeModal(index: number) {

  }

  isInfluenced(modeKey: string) {
    return modeKey === 'citybuild';
  }
}
