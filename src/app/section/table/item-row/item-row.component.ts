import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ItemTableService} from "../shared/item-table.service";

@Component({
  selector: 'table-item-row',
  templateUrl: './item-row.component.html',
  styleUrl: './item-row.component.scss'
})
export class ItemRowComponent implements OnInit, OnDestroy{

  @Input() itemCount: number = 0;

  @ViewChild('itemDesc') itemDesc: ElementRef | undefined;

  protected state: boolean = false;

  constructor(private renderer: Renderer2, private itemTableService: ItemTableService) {
  }

  protected openItem() {
    if (this.itemDesc == undefined) return;

    this.itemTableService.closeAllExcept(this);

    this.state = true;

    this.state = true;
    this.renderer.setStyle(this.itemDesc.nativeElement, 'maxHeight', `${this.itemDesc.nativeElement.scrollHeight}px`);


  }

  public closeItem() {
    if (this.itemDesc == undefined) return;

    this.state = false;

    this.state = false;
    this.renderer.setStyle(this.itemDesc.nativeElement, 'maxHeight', '0');


  }

  protected toggleItem() {

    if(this.state) {
      this.closeItem();
    } else {
      this.openItem();
    }
  }

  ngOnDestroy(): void {
    this.itemTableService.unregisterItem(this);
  }

  ngOnInit(): void {
    this.itemTableService.registerItem(this);
  }

}
