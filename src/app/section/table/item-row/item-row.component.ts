import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ItemTableService} from "../shared/item-table.service";

@Component({
  selector: 'table-item-row',
  templateUrl: './item-row.component.html',
  styleUrl: './item-row.component.scss'
})
export class ItemRowComponent {

  @Input() itemCount: number = 0;

  @ViewChild('itemDesc') itemDesc: ElementRef | undefined;

  protected state: boolean = false;

  constructor(private renderer: Renderer2, private itemTableService: ItemTableService) {
  }

  protected isSmallScreen() {
    return window.innerWidth < 768; // Sie können den Schwellenwert an Ihre Anforderungen anpassen
  }

  openItem() {
    if(this.state) return;
    if (this.itemDesc == undefined) return;

    this.state = true;
    this.renderer.setStyle(this.itemDesc.nativeElement, 'maxHeight', `${this.itemDesc.nativeElement.scrollHeight}px`);

  }

  public closeItem() {
    if(!this.state) return;
    if (this.itemDesc == undefined) return;

    this.state = false;

    this.renderer.setStyle(this.itemDesc.nativeElement, 'maxHeight', '0');
  }

  toggleItem() {
    if(this.state) {
      this.closeItem();
    } else {
      this.openItem();
    }
  }

  onItemClicked() {
    this.itemTableService.toggleItemRow(this);
  }

}
