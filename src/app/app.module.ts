import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { MatIconModule } from '@angular/material/icon';
import { AccountComponent } from './components/account/account.component';
import { LocalizationModule } from './localization/localization.module';
import { L10nTranslationModule } from 'angular-l10n';
import { ArithmeticComponent } from './components/arithmetic/arithmetic.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { NumberSystemsComponent } from './components/number-systems/number-systems.component';
import { MatrixComponent } from './components/matrix/matrix.component';
import { CompoundInterestComponent } from './components/compound-interest/compound-interest.component';
import { SlauComponent } from './components/slau/slau.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AccountComponent,
    ArithmeticComponent,
    NumberSystemsComponent,
    MatrixComponent,
    CompoundInterestComponent,
    SlauComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    HttpClientModule,
    ToastModule,
    MatIconModule,
    LocalizationModule,
    L10nTranslationModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
