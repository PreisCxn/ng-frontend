import {Component, OnInit} from '@angular/core';
import {AdminNavService, AdminSubsites} from "../shared/admin-nav.service";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {AdminNotifyService, AlertType} from "../shared/admin-notify.service";

@Component({
  selector: 'app-mod-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './mod-settings.component.html',
  styleUrl: './mod-settings.component.scss'
})
export class ModSettingsComponent implements OnInit{
  settingsForm: FormGroup;

  submitted = false;
  dirty = false;

  constructor(private fb: FormBuilder, private nav: AdminNavService, private notify: AdminNotifyService) {
    this.settingsForm = this.fb.group({
      modName: [''],
      serverIps: this.fb.array(['']), // Initialisiert mit einem leeren Eintrag
      languages: this.fb.array(['']), // Initialisiert mit einem leeren Eintrag
      minVersion: [''],
      maintenance: [false]
    });
  }

  ngOnInit(): void {
    this.nav.setActiveSubsite(AdminSubsites.MOD_SETTINGS);
  }

  get serverIps() {
    return this.settingsForm.get('serverIps') as FormArray;
  }

  addServerIp() {
    this.dirty = true;
    this.serverIps.push(this.fb.control(''));
  }

  removeServerIp(index: number) {
    this.dirty = true;
    this.serverIps.removeAt(index);
  }

  get languages() {
    return this.settingsForm.get('languages') as FormArray;
  }

  addLanguage() {
    this.dirty = true;
    this.languages.push(this.fb.control(''));
  }

  removeLanguage(index: number) {
    this.dirty = true;
    this.languages.removeAt(index);
  }

  onSubmit(): void {
    this.submitted = true;
    this.dirty = false;

    this.notify.notify(AlertType.SUCCESS, "Einstellungen gespeichert");

    this.settingsForm.markAsPristine();
    // Hier können Sie die Formulardaten verarbeiten
    console.log(this.settingsForm.value);
  }

  isDirty(): boolean {
    return this.settingsForm.dirty || this.dirty;
  }
}
