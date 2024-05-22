import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-compound-interest',
  templateUrl: './compound-interest.component.html',
  styleUrls: ['./compound-interest.component.css'],
})
export class CompoundInterestComponent {
  @ViewChild('myChart') myChart!: ElementRef;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {}
  serverResponse: string | null = null;
  sendData() {
    const email = sessionStorage.getItem('email');
    const initialAmount = (<HTMLInputElement>(
      document.getElementById('initialAmount')
    )).value;
    const additionalContributions = (<HTMLInputElement>(
      document.getElementById('additionalContributions')
    )).value;
    const interestRate = (<HTMLInputElement>(
      document.getElementById('interestRate')
    )).value;
    const contributionFrequency = (<HTMLInputElement>(
      document.getElementById('contributionFrequency')
    )).value;
    const interestFrequency = (<HTMLInputElement>(
      document.getElementById('interestFrequency')
    )).value;
    const years = (<HTMLInputElement>document.getElementById('years')).value;

    const data = {
      email: email,
      initialAmount: initialAmount,
      additionalContributions: additionalContributions,
      interestRate: interestRate,
      contributionFrequency: contributionFrequency,
      interestFrequency: interestFrequency,
      years: years,
      library: 'Java',
    };
    console.log(data);

    this.http
      .post<{ Result: string }>('http://localhost:8080/wolfram/compound', data)
      .subscribe((response) => {
        console.log(response);
        this.serverResponse = response.Result;
        this.createChart(parseInt(years), parseFloat(response.Result));
      });
  }
  createChart(years: number, finalBalance: number) {
    const initialBalance = parseFloat(
      (<HTMLInputElement>document.getElementById('initialAmount')).value
    );
    let currentBalance = initialBalance;
    const annualReplenishment = parseFloat(
      (<HTMLInputElement>document.getElementById('additionalContributions'))
        .value
    );
    const annualInterestRate =
      parseFloat(
        (<HTMLInputElement>document.getElementById('interestRate')).value
      ) / 100;

    const initialBalances = [];
    const replenishments = [];
    const interests = [];

    for (let i = 0; i < years; i++) {
      const interest = currentBalance * annualInterestRate;
      initialBalances.push(initialBalance);
      replenishments.push((i + 1) * annualReplenishment);
      interests.push(interest);

      currentBalance += annualReplenishment + interest;
    }

    const ctx = (this.myChart.nativeElement as HTMLCanvasElement).getContext(
      '2d'
    );

    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Array.from({ length: years }, (_, i) => i + 1),
          datasets: [
            {
              label: 'Начальная сумма',
              data: initialBalances,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Пополнение',
              data: replenishments,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'Начисление процента',
              data: interests,
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              stacked: true,
              beginAtZero: true,
            },
            x: {
              stacked: true,
            },
          },
        },
      });
      console.log('График создан');
    }
  }
  navigateToHome() {
    this.router.navigate(['']);
  }
}
