import {L10nConfig} from 'angular-l10n';

export const l10nConfig: L10nConfig = {
  format: 'language-region',
  providers: [
    {name: 'app', asset: './assets/localization/locale', options: {version: '1.0.0'}}
  ],
  cache: true,
  keySeparator: '.',
  defaultLocale: {language: 'en'},
  schema: [
    {locale: {language: 'en'}, dir: 'ltr', text: 'United States'},
    {locale: {language: 'ru'}, dir: 'ltr', text: 'Russia'}
  ]
};