import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';
import { passwordMatchValidator } from 'src/app/shared/password-match.directive';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private location: Location,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = new FormGroup({
      newPassword: new FormControl(''),
      confirmPassword: new FormControl(''),
    });
  }
  changePassword() {
    // Проверка, что форма и ее поля были инициализированы
    if (
      !this.form ||
      !this.form.get('newPassword') ||
      !this.form.get('confirmPassword')
    ) {
      console.error('Form or form fields are not initialized');
      return;
    }

    // Получение значений из полей ввода
    const newPassword = this.form.get('newPassword')!.value;
    const confirmPassword = this.form.get('confirmPassword')!.value;

    // Проверка, что пароли совпадают
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Отправка запроса на сервер
    this.http
      //.put('http://25.77.202.144:8080/wolfram/changepassword', {
      .put('http://localhost:8080/wolfram/changePassword', {
        email: sessionStorage.getItem('email'),
        password: newPassword,
      })
      .subscribe(
        (response) => {
          // Обработка ответа сервера
          console.log(response);
          this.navigateToHome();
        },
        (error) => {
          // Обработка ошибки
          console.error(error);
        }
      );
  }
  navigateToHome() {
    this.router.navigate(['']);
  }
  submitDetails() {}
}
