import { Component, Inject } from '@angular/core';

import {L10N_LOCALE, L10nLocale, L10nTranslationService} from 'angular-l10n';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-primeng-app';
  constructor(@Inject(L10N_LOCALE) public locale: L10nLocale, private translationService: L10nTranslationService) {
    
  }
}
