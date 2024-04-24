import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';
import { passwordMatchValidator } from 'src/app/shared/password-match.directive';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from 'src/app/services/localization.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm = this.fb.group(
    {
      username: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: passwordMatchValidator,
    }
  );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
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

  get username() {
    return this.registerForm.controls['username'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  submitDetails() {
    const postData = { ...this.registerForm.value };
    delete postData.confirmPassword;
    this.authService.registerUser(postData as User).subscribe(
      (response) => {
        console.log(response);
        this.authService.signOut(); // Выход из текущего аккаунта, если пользователь уже был авторизован
        const email = postData.email || ''; // Проверка на undefined и присвоение пустой строки, если email не определен
        const username = postData.username || '';
        sessionStorage.setItem('email', email); // Авторизация нового пользователя
        sessionStorage.setItem('username', username);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Register successfully',
        });
        this.router.navigate(['home']);
      },
      (error) => {
        console.error(error); // Вывод ошибки в консоль
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong',
        });
      }
    );
  }
}
