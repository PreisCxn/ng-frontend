import {Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {ItemData} from "../../../../shared/types/item.types";
import {AdminService} from "../../../shared/admin.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {ItemSearchPipe} from "../../../shared/item-search.pipe";
import {Optional} from "../../../../shared/optional";
import {NgForOf, NgIf} from "@angular/common";
import {AdminNotifyService, AlertType} from "../../../shared/admin-notify.service";

@Component({
  selector: 'admin-connection-editor',
  standalone: true,
  imports: [
    FormsModule,
    ItemSearchPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './connection-editor.component.html',
  styleUrl: './connection-editor.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ConnectionEditorComponent {

  @Input('data') data: ItemData | undefined;

  @ViewChild('content') public content: any;

  protected searchText: string = '';

  constructor(protected admin: AdminService, private modalService: NgbModal, private notify: AdminNotifyService) {
  }

  public open() {
    this.searchText = '';
    this.modalService.open(this.content, {
      scrollable: true,
      windowClass: 'custom-modal-size'
    })
  }

  public deleteConnection() {
    if (this.data === undefined) return;
    this.admin.editConnection(this.data.pcxnId, null).then(() => {
      this.notify.notify(AlertType.INFO, 'Connection deleted');
    }).catch(() => {
      this.notify.notify(AlertType.DANGER, 'Connection can not be deleted');
    });
  }



  protected selectConnection(item: ItemData) {
    if(this.data === undefined) return;
    this.admin.editConnection(this.data.pcxnId, item.pcxnId).then(() => {
      this.modalService.dismissAll();
      this.notify.notify(AlertType.INFO, 'Connection edited');
    }).catch(() => {
      this.notify.notify(AlertType.DANGER, 'Connection can not be edited');
    });

  }

  protected getItems(): Optional<ItemData[]> {
    if (this.data === undefined) return Optional.empty();

    const items = this.admin.ITEM_DATA.orElse([])
      .filter(item => item.connection === null || item.connection === undefined);

    return Optional.of(items.filter(item => {
      if (this.data === undefined) return false;
      return item.pcxnId !== this.data.pcxnId
    }));
  }


}
