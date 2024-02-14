import { Injectable } from '@angular/core';
import {ModeService} from "../../mode/shared/mode.service";
import {Languages} from "../../shared/languages";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private mode: ModeService) { }

  getCategories(language: Languages) {
    return this.mode.getCategories(language);
  }
}
