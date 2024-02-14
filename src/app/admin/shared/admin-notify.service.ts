import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {AdminModule} from "../admin.module";

export enum AlertType {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  INFO = 'info',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  LIGHT = 'light',
  DARK = 'dark'
}
@Injectable({
  providedIn: AdminModule
})
export class AdminNotifyService {
  private alertSubject = new Subject<{type: any, message: string}>();

  constructor() { }

  public notify(type: AlertType, message: string) {
    this.alertSubject.next({type, message});
  }

  public getAlert() {
    return this.alertSubject.asObservable();
  }
}
