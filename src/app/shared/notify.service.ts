import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private toastr: ToastrService) {
    this.toastr.toastrConfig.preventDuplicates = true;
  }

  public error(message: string, title:string): void {
    this.toastr.error(message, title, {
      positionClass: 'toast-bottom-left',
      closeButton: true,
      progressBar: true,
    });
  }

  public success(message: string, title: string): void {
    this.toastr.success(message, title, {
      positionClass: 'toast-bottom-left',
      closeButton: true,
      progressBar: true,
    });
  }
}
