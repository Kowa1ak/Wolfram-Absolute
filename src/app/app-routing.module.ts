import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { AccountComponent } from './components/account/account.component';
import { ArithmeticComponent } from './components/arithmetic/arithmetic.component';
import { NumberSystemsComponent } from './components/number-systems/number-systems.component';
import { MatrixComponent } from './components/matrix/matrix.component';
import { CompoundInterestComponent } from './components/compound-interest/compound-interest.component';
import { SlauComponent } from './components/slau/slau.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'account',
    component: AccountComponent,
  },
  {
    path: 'arithmetic',
    component: ArithmeticComponent,
  },
  {
    path: 'number-systems',
    component: NumberSystemsComponent,
  },
  {
    path: 'matrix-operations',
    component: MatrixComponent,
  },
  {
    path: 'compound-interest',
    component: CompoundInterestComponent,
  },
  {
    path: 'slau',
    component: SlauComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
