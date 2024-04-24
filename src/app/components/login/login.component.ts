import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/auth';
import { LanguageService } from 'src/app/services/localization.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msgService: MessageService,
    public languageService: LanguageService
  ) {}
  ngOnInit() {
    this.languageService.setActiveLanguage(this.languageService.activeLanguage);
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
  navigateToHome() {
    this.router.navigate(['']);
  }
  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }
  onButtonClick(event: Event) {
    // Проверяем, является ли нажатая кнопка кнопкой входа в систему
    if ((event.target as Element).classList.contains('btnSignIn')) {
      // Если это кнопка входа в систему, выполняем вход в систему
      this.loginUser();
    }
  }

  loginUser() {
    const { email, password } = this.loginForm.value;
    this.authService.loginUser({ email, password } as User).subscribe(
      (response) => {
        console.log(response);
        sessionStorage.setItem('email', email as string);
        sessionStorage.setItem('username', response.username);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error(error);
        this.msgService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid email or password',
        });
      }
    );
  }
}
