import {Component, OnInit} from '@angular/core';
import {AdminNavService, AdminSubsites} from "../shared/admin-nav.service";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {AdminNotifyService, AlertType} from "../shared/admin-notify.service";
import {AdminService} from "../shared/admin.service";
import {ModData} from "../../shared/types/mod.types";
import {Optional} from "../../shared/optional";

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
export class ModSettingsComponent implements OnInit {
  settingsForm: FormGroup;

  submitted = false;
  dirty = false;

  constructor(private fb: FormBuilder, private nav: AdminNavService, private notify: AdminNotifyService, protected admin: AdminService) {
    this.settingsForm = this.fb.group({
      modName: [''],
      serverIps: this.fb.array(['']),
      languages: this.fb.array(['']),
      minVersion: [''],
      maintenance: [false]
    });
    this.refreshForm();
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

  private refreshForm() {
    this.admin.getModSettings().then(mod => {
      this.settingsForm.patchValue({
        modName: mod.modName,
        minVersion: mod.minVersion,
        maintenance: mod.maintenance
      }, {emitEvent: false, onlySelf: true});

      this.serverIps.clear();
      mod.serverIps.forEach(ip => this.serverIps.push(this.fb.control(ip)));
      this.languages.clear();
      mod.languages.forEach(lang => this.languages.push(this.fb.control(lang)));
    });
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

    const changes = this.calcChanges();

    if (changes.isEmpty()) {
      this.notify.notify(AlertType.INFO, "Keine Änderungen");
      return;
    }

    this.admin.updateModSettings(changes.get())
      .then(mod => {
        this.notify.notify(AlertType.SUCCESS, "Einstellungen gespeichert");
        this.settingsForm.markAsPristine();
        this.refreshForm();
      })
      .catch(e => {
        this.notify.notify(AlertType.DANGER, "Fehler beim Speichern der Einstellungen");
        console.error(e);
      });

  }

  private calcChanges(): Optional<Partial<ModData>> {
    const lastModUpdate = this.admin.MOD_SETTINGS.get();

    if (!lastModUpdate) return Optional.empty();

    const changes: Partial<ModData> = {};

    if (lastModUpdate.modName !== this.settingsForm.get('modName')?.value)
      changes.modName = this.settingsForm.get('modName')?.value;

    if (lastModUpdate.minVersion !== this.settingsForm.get('minVersion')?.value)
      changes.minVersion = this.settingsForm.get('minVersion')?.value;

    if (lastModUpdate.maintenance !== this.settingsForm.get('maintenance')?.value)
      changes.maintenance = this.settingsForm.get('maintenance')?.value;

    const serverIps = this.settingsForm.get('serverIps')?.value as string[];
    if (lastModUpdate.serverIps.join(',') !== serverIps.join(','))
      changes.serverIps = serverIps;

    const languages = this.settingsForm.get('languages')?.value as string[];
    if (lastModUpdate.languages.join(',') !== languages.join(','))
      changes.languages = languages;

    return Optional.of(changes);
  }

  isDirty(): boolean {
    return this.settingsForm.dirty || this.dirty;
  }
}
