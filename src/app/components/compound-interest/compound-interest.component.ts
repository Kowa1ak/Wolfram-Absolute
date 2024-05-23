import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import 'chartjs-plugin-zoom';
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
export class CompoundInterestComponent implements AfterViewInit {
  @ViewChild('myChart') myChart!: ElementRef;
  private chart: Chart | null = null;
  serverResponse: Array<{
    InitialAmount: string;
    AdditionalContributions: string;
    Interest: string;
  }> | null = null;
  totalFinalAmount: number = 0;
  totalReplenishments: number = 0;
  totalInterests: number = 0;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {}
  ngAfterViewInit() {
    this.initChart();
  }

  initChart() {
    const initialBalances = [10, 10, 10, 10, 10, 10];
    const replenishments = [10, 20, 30, 40, 50, 60];
    const interests = [35, 40, 45, 50, 55, 60];

    const ctx = (this.myChart.nativeElement as HTMLCanvasElement).getContext(
      '2d'
    );
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Array.from({ length: 6 }, (_, i) => i + 1),
          datasets: [
            {
              label: 'Начальная сумма',
              data: initialBalances,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              barPercentage: 0.5,
            },
            {
              label: 'Пополнение',
              data: replenishments,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              barPercentage: 0.5,
            },
            {
              label: 'Начисление процента',
              data: interests,
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
              barPercentage: 0.5,
            },
          ],
        },
        options: {
          responsive: true, // График будет менять размер в соответствии с родительским элементом
          maintainAspectRatio: false,
          scales: {
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: {
                color: 'white', // Устанавливаем цвет шрифта на оси Y
                font: {
                  size: 20, // Увеличиваем размер шрифта на оси Y
                },
              },
            },
            x: {
              stacked: true,
              ticks: {
                color: 'white', // Устанавливаем цвет шрифта на оси X
                font: {
                  size: 20, // Увеличиваем размер шрифта на оси X
                },
              },
            },
          },
          plugins: {
            legend: {
              position: 'bottom', // Перемещаем легенду вниз
              labels: {
                color: 'white',
                font: {
                  size: 15,
                },
                boxWidth: 20, // Используем квадратные маркеры
              },
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });
      console.log('График создан');
    }
  }
  sendData() {
    const email = sessionStorage.getItem('email');
    const initialAmount = parseFloat(
      (<HTMLInputElement>document.getElementById('initialAmount')).value
    );
    const additionalContributions = parseFloat(
      (<HTMLInputElement>document.getElementById('additionalContributions'))
        .value
    );
    const interestRate =
      parseFloat(
        (<HTMLInputElement>document.getElementById('interestRate')).value
      ) / 100;
    const contributionFrequency = parseInt(
      (<HTMLInputElement>document.getElementById('contributionFrequency')).value
    );
    const interestFrequency = parseInt(
      (<HTMLInputElement>document.getElementById('interestFrequency')).value
    );
    const years = parseInt(
      (<HTMLInputElement>document.getElementById('years')).value
    );

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
      .post<
        Array<{
          InitialAmount: string;
          AdditionalContributions: string;
          Interest: string;
        }>
      >('http://localhost:8080/wolfram/compound', data)
      .subscribe((response) => {
        console.log(response);
        this.serverResponse = response;
        this.createChart(years, response);
      });
  }

  createChart(
    years: number,
    finalBalance: Array<{
      InitialAmount: string;
      AdditionalContributions: string;
      Interest: string;
    }>
  ) {
    const initialBalances = finalBalance.map((item) =>
      parseFloat(item.InitialAmount)
    );
    const replenishments = finalBalance.map((item) =>
      parseFloat(item.AdditionalContributions)
    );
    const interests = finalBalance.map((item) => parseFloat(item.Interest));
    this.totalFinalAmount = Math.round(
      initialBalances[initialBalances.length - 1] +
        replenishments[replenishments.length - 1] +
        interests[interests.length - 1]
    );
    this.totalReplenishments = Math.round(
      replenishments.reduce((a, b) => a + b, 0)
    );
    this.totalInterests = Math.round(interests.reduce((a, b) => a + b, 0));
    if (this.chart) {
      // Обновляем данные в существующем графике
      this.chart.data.labels = Array.from({ length: years }, (_, i) => i + 1);
      this.chart.data.datasets[0].data = initialBalances;
      this.chart.data.datasets[1].data = replenishments;
      this.chart.data.datasets[2].data = interests;

      // Обновляем график
      this.chart.update();
    } else {
      // Если графика еще нет, создаем его
      this.initChart();
    }
  }

  navigateToHome() {
    this.router.navigate(['']);
  }
}
