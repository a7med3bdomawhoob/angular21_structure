import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { LANGUAGE_ENUM } from '../enums/language-enum';
import { LOCALSTORAGE_ENUM } from '../enums/local-storage-enum';
import { LocalStorageService } from './local-storage.service';
import { FactoryService } from './factory-service';

//npm i @ngx-translate/core @ngx-translate/http-loader

@Injectable({ providedIn: 'root' })
export class LanguageService {
  translateService = inject(TranslateService);
  localStorageService = inject(LocalStorageService);
  private _currentLanguage: string = LANGUAGE_ENUM.ENGLISH.toString();
  languageChanged$: BehaviorSubject<string> = new BehaviorSubject(this._currentLanguage);

  constructor() {
    // Initialize _currentLanguage from localStorage if it exists
    const storedLanguage = this.localStorageService.get(LOCALSTORAGE_ENUM.LANGUAGE);
    if (storedLanguage) {
      this._currentLanguage = storedLanguage;
      //this.translateService.use(storedLanguage);
    }

    FactoryService.registerService('LanguageService', this);
  }

  getCurrentLanguage(): string {
    return this._currentLanguage;
  }

  setLanguage(lang: any) {
    this._currentLanguage = lang;
    this.translateService.use(lang);
    this.localStorageService.set(LOCALSTORAGE_ENUM.LANGUAGE, lang);
    this.languageChanged$.next(this._currentLanguage);
  }
}
