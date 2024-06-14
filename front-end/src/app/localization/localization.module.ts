import {APP_INITIALIZER, NgModule} from '@angular/core';
import {L10nIntlModule, L10nLoader, L10nTranslationModule} from 'angular-l10n';
import {l10nConfig} from './localization.config';
import {HttpTranslationLoader} from './http-translation-loader';
import {initL10n} from './localization.factory';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  imports: [
    L10nTranslationModule.forRoot(
      l10nConfig, {
        translationLoader: HttpTranslationLoader
      }),
    L10nIntlModule,
    HttpClientModule
  ],
  providers: [
    HttpTranslationLoader,
    {
      provide: APP_INITIALIZER,
      useFactory: initL10n,
      deps: [L10nLoader],
      multi: true
    }
  ],
})
export class LocalizationModule {
}