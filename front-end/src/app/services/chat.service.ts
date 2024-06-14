// chat.service.ts
import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient: any;
  colors = ['red', 'green', 'blue'];
  private messageSubject = new Subject<any>();
  public messages = this.messageSubject.asObservable();
  private serverUrl = 'http://localhost:8080/ws';
  constructor() {}
}
