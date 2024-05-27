// calculation-history.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CalculationHistoryService {
  public _isHistoryOpen = new BehaviorSubject<boolean>(false);
  isHistoryOpen = this._isHistoryOpen.asObservable();
  private _history = new BehaviorSubject<any[]>([]);
  history = this._history.asObservable();

  constructor(private http: HttpClient) {}

  toggleHistory() {
    this._isHistoryOpen.next(!this._isHistoryOpen.value);
    this.updateHistory();
  }
  setHistoryOpen(isOpen: boolean) {
    this._isHistoryOpen.next(isOpen);
  }

  updateHistory() {
    const email = sessionStorage.getItem('email');
    const data = { email: email };
    this.http
      .post('http://localhost:8080/wolfram/by-email', data)
      .subscribe((response) => {
        console.log(response);
        this._history.next(response as any[]);
      });
  }
}
