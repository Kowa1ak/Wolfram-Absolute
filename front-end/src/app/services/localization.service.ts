import { Component, Inject, Injectable } from '@angular/core';
import { L10N_LOCALE, L10nLocale, L10nTranslationService  } from 'angular-l10n';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  activeLanguage = 'EN';
  showLanguageOptions = false;

  constructor(@Inject(L10N_LOCALE) public locale: L10nLocale,
  private translation: L10nTranslationService) { }

  toggleLanguageOptions() {
    this.showLanguageOptions = !this.showLanguageOptions;
  }

  setActiveLanguage(language: string) {
    this.activeLanguage = language;
    this.showLanguageOptions = false;
    this.translation.setLocale({ language: this.activeLanguage.toLowerCase()});
  }
}