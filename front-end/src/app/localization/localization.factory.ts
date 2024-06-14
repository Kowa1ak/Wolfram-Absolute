import {L10nLoader} from 'angular-l10n';

export function initL10n(l10nLoader: L10nLoader): () => Promise<void> {
  return () => l10nLoader.init();
}