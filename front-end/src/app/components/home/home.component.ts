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
  navigateToArithmetic() {
    setTimeout(() => {
      this.router.navigate(['/arithmetic']);
    }, 200);
  }

  navigateToNumberSystems() {
    setTimeout(() => {
      this.router.navigate(['/number-systems']);
    }, 200);
  }

  navigateToMatrixOperations() {
    setTimeout(() => {
      this.router.navigate(['/matrix-operations']);
    }, 200);
  }
  navigateToCompoundInterest() {
    setTimeout(() => {
      this.router.navigate(['/compound-interest']);
    }, 200);
  }
  navigateToSlau() {
    setTimeout(() => {
      this.router.navigate(['/slau']);
    }, 200);
  }
  navigateToIntegral() {
    setTimeout(() => {
      this.router.navigate(['/integral']);
    }, 200);
  }

  reloadPage() {
    window.location.reload();
  }
}
