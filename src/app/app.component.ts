import {
  Component,
  Inject,
  Renderer2,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { L10N_LOCALE, L10nLocale, L10nTranslationService } from 'angular-l10n';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/auth';
import { Observable, of } from 'rxjs';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public stompClient: any;
  public username: string | null = null;
  public messageInput: string = '';
  public messages: { sender: string; content: string; type: string }[] = [];
  routeSubscription: Subscription | undefined;
  loggedInUsers$: Observable<User[]> = of([]);
  isChatOpen = false;
  globalClick: Function | null = null;
  @ViewChild('chatPanel', { static: false }) chatPanel!: ElementRef;
  @ViewChild('name') name: ElementRef | undefined;
  isButtonActive = false;
  isOverlayVisible = false;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private translationService: L10nTranslationService,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.connect();
    this.globalClick = this.renderer.listen('document', 'click', (event) => {
      if (
        !this.chatPanel.nativeElement.contains(event.target) &&
        this.isChatOpen
      ) {
        this.isChatOpen = false;
        this.isOverlayVisible = false;
      }
    });
    this.routeSubscription = this.router.events.subscribe((event) => {
      this.isOverlayVisible = false;
    });
  }

  ngOnDestroy() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    if (this.globalClick) {
      this.globalClick();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  toggleChat(event: MouseEvent) {
    event.stopPropagation();
    this.isChatOpen = !this.isChatOpen;
    this.isOverlayVisible = this.isChatOpen;
  }

  isUserLoggedIn() {
    return this.authService.isUserLoggedIn();
  }
  getUsername(): Observable<string> {
    const username = sessionStorage.getItem('username');
    return of(username ? username : '');
  }

  isLoginPage() {
    return (
      this.router.url === '/login' ||
      this.router.url === '/register' ||
      this.router.url === '/account'
    );
  }
  connect() {
    this.getUsername().subscribe((username) => {
      this.username = username.trim();
      if (this.username) {
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect(
          {},
          this.onConnected.bind(this),
          this.onError.bind(this)
        );
      }
    });
  }
  onConnected() {
    this.stompClient.subscribe(
      '/topic/public',
      this.onMessageReceived.bind(this)
    );

    this.stompClient.send(
      '/app/chat.addUser',
      {},
      JSON.stringify({ sender: this.username, type: 'JOIN' })
    );
  }
  onError(error: any) {
    console.error(
      'Could not connect to WebSocket server. Please refresh this page to try again!',
      error
    );
  }

  sendMessage(event: any) {
    const messageContent = this.messageInput.trim();
    if (messageContent && this.stompClient && this.username) {
      const chatMessage = {
        sender: this.username,
        content: this.messageInput,
        type: 'CHAT',
      };
      this.stompClient.send(
        '/app/chat.sendMessage',
        {},
        JSON.stringify(chatMessage)
      );
      this.isButtonActive = true;
      setTimeout(() => (this.isButtonActive = false), 200);
    }
    event.preventDefault();
    this.messageInput = '';
  }
  onMessageReceived(payload: any) {
    const message = JSON.parse(payload.body);

    if (message.type === 'JOIN') {
      message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
      message.content = message.sender + ' left!';
    }
    if (!message.content || !message.sender) {
      return; // Не добавлять сообщение, если нет содержимого или отправителя
    }
    this.messages.unshift(message);
  }
  userColors: { [key: string]: string } = {};

  getColorForUser(user: string): string {
    if (!this.userColors[user]) {
      this.userColors[user] =
        '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    return this.userColors[user];
  }
  handleInput(event: any) {
    this.messageInput = event.target.value;
  }
  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.stompClient = null;
    }
    this.username = null;
  }
}
