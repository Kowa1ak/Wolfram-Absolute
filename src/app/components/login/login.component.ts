import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  })
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msgService: MessageService
  ) { }
  navigateToHome() {
    this.router.navigate(['']);
  }
  get email() {
    return this.loginForm.controls['email'];
  }
  get password() { return this.loginForm.controls['password']; }
  loginUser() {
    const { email, password } = this.loginForm.value;
    this.authService.loginUser({ email, password } as User).subscribe(
      response => {
        console.log(response);
        sessionStorage.setItem('email', email as string);
        sessionStorage.setItem('username', response.username);
        this.router.navigate(['/home']);
      },
      error => {
        console.error(error)
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email or password' });
      }
    )
  }
  
}
