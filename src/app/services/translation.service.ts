import { Injectable } from '@angular/core';
import {Languages} from "./languages";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private language: Languages = Languages.English;

  constructor() { }
}
