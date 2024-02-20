import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Languages} from "../../../../shared/languages";
import {AdminNotifyService, AlertType} from "../../../shared/admin-notify.service";
import {Translation} from "../../../../shared/types/translation.types";

@Component({
  selector: 'app-translation-editor',
  standalone: true,
  templateUrl: './translation-editor.component.html',
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./translation-editor.component.scss']
})
export class TranslationEditorComponent implements OnInit {
  @ViewChild('content') content: any;
  editingIndex: number | null = null;
  language: string = '';
  translation: string = '';

  LANGUAGES = Object.values(Languages);

  @Output() translationChange = new EventEmitter<Translation[]>();
  @Input('data') translations: Translation[] = [];
  @Input('minLang') minLang: Languages[] | 'all' = [Languages.German];

  constructor(private modalService: NgbModal, private notify: AdminNotifyService) {
  } // NgbModal injizieren

  get editingTranslation(): Translation | null {
    return this.editingIndex !== null ? this.translations[this.editingIndex] : null;
  }

  startEditing(index: number): void {
    console.log('startEditing')
    this.editingIndex = index;

    this.language = this.translations[index].language;
    this.translation = this.translations[index].translation;
    console.log(this.editingTranslation); // Fügen Sie diese Zeile hinzu
    this.modalService.open(this.content); // Modal öffnen
  }

  saveTranslation(): void {
    if (this.editingIndex !== null) {
      if (!this.isLanguageUnique(this.language)) {
        this.notify.notify(AlertType.DANGER, 'Die Sprache wurde schon gesetzt.');
        return;
      }
      this.translations[this.editingIndex] = {language: this.language, translation: this.translation};
      this.translationChange.emit(this.translations); // Emit the change
      this.editingIndex = null;
      this.modalService.dismissAll(); // Schließt das Modal
    }
  }

  addTranslation(): void {
    let uniqueLanguageFound = false;

    for (let lang of this.LANGUAGES) {
      if (this.isLanguageUnique(lang)) {
        this.language = lang;
        uniqueLanguageFound = true;
        break;
      }
    }

    if (!uniqueLanguageFound) {
      this.notify.notify(AlertType.DANGER, 'Alle Sprachen wurden schon gesetzt');
      return;
    }
    this.translations.push({language: '', translation: ''});
    this.startEditing(this.translations.length - 1);
  }

  removeTranslation(index: number): void {
    this.translations.splice(index, 1);
    this.translationChange.emit(this.translations); // Emit the change
  }

  isLanguageUnique(language: string): boolean {
    if (language === '') {
      this.notify.notify(AlertType.DANGER, 'Bitte geben Sie eine Sprache ein.');
      return false;
    }

    return !this.translations.some((t, index) => index !== this.editingIndex && t.language === language);
  }

  public static displayTranslation(translation: Translation[]): string {
    return translation.map(t => `${t.language}: ${t.translation}`).join(', ');
  }

  public static getGermanTranslation(translation: Translation[]): string {
    return translation.find(t => t.language === Languages.German)?.translation || translation[0].translation || '';
  }

  static isValid(translation: Translation[], minLang: Languages[] | 'all', LANGUAGES: Languages[] = Object.values(Languages)): boolean {
    if(minLang === 'all') minLang = LANGUAGES;

    // Überprüfen, ob alle minLang in den Übersetzungen vorhanden sind
    const allMinLangPresent = minLang.every(lang => translation.some(t => t.language === lang));

    // Überprüfen, ob für jede Sprache nur ein Eintrag vorhanden ist
    const onlyOneEntryForEachLang = translation.filter((t, i, arr) => arr.findIndex(t2 => t2.language === t.language) === i).length === translation.length;

    // Überprüfen, ob alle Übersetzungen aus LANGUAGES stammen
    const allTranslationsFromLANGUAGES = translation.every(t => LANGUAGES.includes(t.language as Languages));

    // Überprüfen, ob die Übersetzung nicht leer ist
    const allTranslationsNotEmpty = translation.every(t => t.translation !== '');

    return allMinLangPresent && onlyOneEntryForEachLang && allTranslationsFromLANGUAGES && allTranslationsNotEmpty;
  }

  protected readonly Languages = Languages;
  protected readonly Object = Object;

  ngOnInit(): void {
    if (this.minLang === 'all') {
      this.minLang = Object.values(Languages);
    }

    this.LANGUAGES.sort((a, b) => {
      if (this.minLang.includes(a) && !this.minLang.includes(b)) {
        return -1;
      }
      if (!this.minLang.includes(a) && this.minLang.includes(b)) {
        return 1;
      }
      return 0;
    });
  }
}
