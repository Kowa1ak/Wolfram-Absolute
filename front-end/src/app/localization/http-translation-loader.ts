import {Injectable} from '@angular/core';
import {L10nProvider, L10nTranslationLoader} from 'angular-l10n';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class HttpTranslationLoader implements L10nTranslationLoader {

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  public get(language: string, provider: L10nProvider): Observable<{ [key: string]: any }> {
    const url = `${provider.asset}-${language}.json`;
    const options = {
      headers: this.headers,
      params: new HttpParams().set('v', provider.options.version)
    };
    return this.http.get(url, options);
  }

}