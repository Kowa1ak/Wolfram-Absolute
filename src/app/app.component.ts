import {
  Component,
  Inject,
  Renderer2,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { L10N_LOCALE, L10nLocale, L10nTranslationService } from 'angular-l10n';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-primeng-app';
  isChatOpen = false;
  globalClick: Function | null = null;
  @ViewChild('chatPanel', { static: false }) chatPanel!: ElementRef;

  constructor(
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private translationService: L10nTranslationService,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.globalClick = this.renderer.listen('document', 'click', (event) => {
      if (
        !this.chatPanel.nativeElement.contains(event.target) &&
        this.isChatOpen
      ) {
        this.isChatOpen = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.globalClick) {
      this.globalClick();
    }
  }

  toggleChat(event: MouseEvent) {
    event.stopPropagation();
    this.isChatOpen = !this.isChatOpen;
  }
  isUserLoggedIn() {
    return this.authService.isUserLoggedIn(); // Используйте метод isUserLoggedIn из AuthService
  }
  isLoginPage() {
    return (
      this.router.url === '/login' ||
      this.router.url === '/register' ||
      this.router.url === '/account'
    );
  }
}
