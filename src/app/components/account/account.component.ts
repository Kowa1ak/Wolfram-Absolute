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

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private location: Location,
    private router: Router
  ) { }
  navigateToHome() {
    this.router.navigate(['']);
  }
  submitDetails() {
  }
}
