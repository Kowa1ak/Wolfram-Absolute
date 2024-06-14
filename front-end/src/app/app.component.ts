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
import { CalculationHistoryService } from 'src/app/services/calculation-history.service';
import { LanguageService } from 'src/app/services/localization.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public stompClient: any;
  public username: string | null = null;
  public messageInput: string = '';
  public messages: {
    sender: string;
    content: string;
    type: string;
    isHistory?: boolean;
  }[] = [];
  routeSubscription: Subscription | undefined;
  loggedInUsers$: Observable<User[]> = of([]);
  isChatOpen = false;
  isHistoryOpen = false;
  globalClickOutsideHistory: Function | null = null;
  globalClick: Function | null = null;
  @ViewChild('chatPanel', { static: false }) chatPanel!: ElementRef;
  @ViewChild('historyPanel', { static: false }) historyPanel!: ElementRef;
  @ViewChild('name') name: ElementRef | undefined;
  @ViewChild('toggleButton', { static: false }) toggleButton!: ElementRef;
  isButtonActive = false;
  isOverlayVisible = false;
  history: any[] = [];
  hoveredCardIndex: number | null = null;
  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private translationService: L10nTranslationService,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    public calculationHistoryService: CalculationHistoryService,
    public languageService: LanguageService
  ) {
    this.calculationHistoryService.history.subscribe((newHistory) => {
      this.history = newHistory;
    });
  }
  onMouseEnter(index: number): void {
    this.hoveredCardIndex = index;
  }

  onMouseLeave(): void {
    this.hoveredCardIndex = null;
  }
  formatTime(time: string): string {
    return (parseFloat(time) * 10000 || 0).toFixed(3);
  }
  formatResult(result: string): string {
    return result
      .split(' ')
      .map((num) => {
        const parsedNum = parseFloat(num);
        return Number.isInteger(parsedNum)
          ? parsedNum.toString()
          : parsedNum.toFixed(3);
      })
      .join(' ');
  }
  ngOnInit() {
    this.connect();
    this.languageService.setActiveLanguage(this.languageService.activeLanguage);
    this.globalClick = this.renderer.listen('document', 'click', (event) => {
      if (
        !this.chatPanel.nativeElement.contains(event.target) &&
        this.isChatOpen
      ) {
        this.isChatOpen = false;
        this.isOverlayVisible = false;
      }
    });

    this.globalClick = this.renderer.listen('document', 'click', (event) => {
      if (
        !this.historyPanel.nativeElement.contains(event.target) &&
        this.calculationHistoryService._isHistoryOpen.value
      ) {
        this.calculationHistoryService.setHistoryOpen(false);
      }
    });
  }

  ngOnDestroy() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    if (this.globalClick) {
      this.globalClick();
    }
    if (this.globalClickOutsideHistory) {
      this.globalClickOutsideHistory();
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
        isHistory: true,
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
    console.log('Received message:', message);
    if (message.type === 'JOIN') {
      message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
      message.content = message.sender + ' left!';
    }
    if (!message.content || !message.sender) {
      return; // Не добавлять сообщение, если нет содержимого или отправителя
    }

    // Проверка, является ли сообщение историей
    if (message.content.startsWith('Shared history:')) {
      message.isHistory = true;
    }

    this.messages.unshift(message);
  }
  shareHistory(index: number) {
    if (this.history[index]) {
      const historyItem = this.history[index];
      const messageContent = `Shared history: \n
                            ID: ${historyItem.id} \n
                            Email: ${historyItem.email} \n
                            Calculation Type: ${historyItem.calculationType} \n
                            Input Data: ${historyItem.inputData} \n
                            Result Data: ${historyItem.resultData}`;

      if (messageContent && this.stompClient && this.username) {
        const chatMessage = {
          sender: this.username,
          content: messageContent,
          type: 'CHAT',
          isHistory: true, // установите это свойство в true
        };

        this.stompClient.send(
          '/app/chat.sendMessage',
          {},
          JSON.stringify(chatMessage)
        );
      }
    }
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
  hideOverlay() {
    this.isOverlayVisible = false;
  }
  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.stompClient = null;
    }
    this.username = null;
  }
}
