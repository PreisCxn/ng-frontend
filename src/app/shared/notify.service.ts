import {Injectable} from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private toastr: ToastrService) {
    this.toastr.toastrConfig.preventDuplicates = true;
  }

  public warning(message: string, title: string, onclick: () => void): void {
    const toast = this.toastr.warning(message, title, {
      positionClass: 'toast-bottom-left',
      closeButton: true,
      progressBar: true,
      timeOut: 9000,
    });
    const clickSub = toast.onTap.subscribe(onclick);
    toast.onHidden.subscribe(() => clickSub.unsubscribe());
  }

  public info(message: string, title: string, onclick: () => void): void {
    const toast = this.toastr.info(message, title, {
      positionClass: 'toast-bottom-left',
      closeButton: false,
      progressBar: true,
      timeOut: 8000,
    });
    const clickSub = toast.onTap.subscribe(onclick);
    toast.onHidden.subscribe(() => clickSub.unsubscribe());
  }

  public error(message: string, title: string): void {
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
