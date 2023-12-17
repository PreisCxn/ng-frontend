import { TestBed } from '@angular/core/testing';

import { TranslationService } from './translation.service';
import {Languages} from "./languages";

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change current language', () => {
    service.setLanguage(Languages.German);
    expect(service.getCurrentLanguage()).toEqual(Languages.German);
    service.setLanguage(Languages.English);
    expect(service.getCurrentLanguage()).toEqual(Languages.English);
  });

  it('should return translation', async () => {
    await service.setLanguage(Languages.German);
    console.log(service.getTranslation('testing.lang'));
    expect(service.getTranslation('testing.lang')).toEqual(Languages.German);
    await service.setLanguage(Languages.English);
    expect(service.getTranslation('testing.lang')).toEqual(Languages.English);
    await service.setLanguage(Languages.MemeCxn);
    expect(service.getTranslation('testing.lang')).toEqual(Languages.MemeCxn);
  });

});
