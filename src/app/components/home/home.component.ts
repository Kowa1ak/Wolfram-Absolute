import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/localization.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    this.languageService.setActiveLanguage(this.languageService.activeLanguage);
  }

  signOut() {
    this.authService.signOut();
  }
  get showLanguageOptions() {
    return this.languageService.showLanguageOptions;
  }

  get activeLanguage() {
    return this.languageService.activeLanguage;
  }
  toggleLanguageOptions() {
    this.languageService.toggleLanguageOptions();
  }

  setActiveLanguage(language: string) {
    this.languageService.setActiveLanguage(language);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToAccount() {
    this.router.navigate(['/account']);
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  reloadPage() {
    window.location.reload();
  }
}
