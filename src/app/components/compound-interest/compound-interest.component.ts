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
import { throwError } from 'rxjs';
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
  @ViewChild('initialAmountInput', { static: false })
  initialAmountInput!: ElementRef;
  @ViewChild('monthlyContributionInput', { static: false })
  monthlyContributionInput!: ElementRef;
  @ViewChild('interestRateInput', { static: false })
  interestRateInput!: ElementRef;
  @ViewChild('yearsInput', { static: false })
  yearsInput!: ElementRef;
  private chart: Chart | null = null;
  rangeValue = 0;
  selectedContributionButton: HTMLButtonElement | null = null;
  selectedInterestButton: HTMLButtonElement | null = null;
  selectedContributionValue: string = '';
  selectedInterestValue: string = '';
  selectedButton: string = 'Java';
  serverResponse: Array<{
    InitialAmount: string;
    AdditionalContributions: string;
    Interest: string;
  }> | null = null;
  totalFinalAmount: number = 0;
  totalReplenishments: number = 0;
  totalInterests: number = 0;
  selectedCurrency: string = '$';
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
    if (this.chart) {
      this.chart.destroy();
    }
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
              backgroundColor: 'rgba(143, 140, 255, 0.6)',
              borderColor: 'rgba(143, 140, 255, 1)',
              borderWidth: 1,
              barPercentage: 0.5,
            },
            {
              label: 'Пополнение',
              data: replenishments,
              backgroundColor: 'rgba(106, 103, 219, 0.6)',
              borderColor: 'rgba(106, 103, 219, 1)',
              borderWidth: 1,
              barPercentage: 0.5,
            },
            {
              label: 'Начисление процента',
              data: interests,
              backgroundColor: 'rgba(58, 71, 215, 0.6)',
              borderColor: 'rgba(58, 71, 215, 1)',
              borderWidth: 1,
              barPercentage: 0.5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: {
                color: 'white',
                font: {
                  size: 20,
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
  selectContributionButton(event: Event) {
    if (this.selectedContributionButton) {
      this.selectedContributionButton.classList.remove('selected');
    }
    const target = event.target as HTMLButtonElement;
    target.classList.add('selected');
    this.selectedContributionButton = target;
    this.selectedContributionValue = target.value; // сохраняем значение кнопки
  }

  selectInterestButton(event: Event) {
    if (this.selectedInterestButton) {
      this.selectedInterestButton.classList.remove('selected');
    }
    const target = event.target as HTMLButtonElement;
    target.classList.add('selected');
    this.selectedInterestButton = target;
    this.selectedInterestValue = target.value; // сохраняем значение кнопки
  }
  onRangeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.rangeValue = Number(target.value);
  }
  setFrequency(event: Event) {
    const target = event.target as HTMLButtonElement;
    const frequency = Number(target.value);
    // Здесь вы можете обработать изменение частоты
    console.log(frequency);
  }
  getSymbolForCurrency(currency: string): string {
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'RUB':
        return '₽';
      default:
        return '$';
    }
  }
  onCurrencyChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCurrency = this.getSymbolForCurrency(target.value);
  }
  sendData() {
    const email = sessionStorage.getItem('email');
    const initialAmountElement = <HTMLInputElement>(
      document.getElementById('initialAmount')
    );
    const additionalContributionsElement = <HTMLInputElement>(
      document.getElementById('additionalContributions')
    );
    const interestRateElement = <HTMLInputElement>(
      document.getElementById('interestRate')
    );
    const yearsElement = <HTMLInputElement>document.getElementById('years');

    const initialAmount = parseFloat(initialAmountElement.value);
    const additionalContributions = parseFloat(
      additionalContributionsElement.value
    );
    const interestRate = parseFloat(interestRateElement.value) / 100;
    const years = parseInt(yearsElement.value);

    const data = {
      email: email,
      initialAmount: initialAmount,
      additionalContributions: additionalContributions,
      interestRate: interestRate,
      contributionFrequency: this.selectedContributionValue, // используем сохраненное значение
      interestFrequency: this.selectedInterestValue, // используем сохраненное значение
      years: years,
      library: this.selectedButton,
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
      .pipe(
        catchError((error) => {
          console.error('An error occurred:', error);
          return throwError(error);
        })
      )
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
  clearForm() {
    this.initialAmountInput.nativeElement.value = '';
    this.monthlyContributionInput.nativeElement.value = '';
    this.interestRateInput.nativeElement.value = '0';
    this.rangeValue = 0;
    this.yearsInput.nativeElement.value = '';
    this.selectedButton = 'Java';
    this.totalReplenishments = 0;
    this.totalFinalAmount = 0;
    this.totalInterests = 0;
    if (this.selectedContributionButton) {
      this.selectedContributionButton.classList.remove('selected');
      this.selectedContributionButton = null;
    }

    if (this.selectedInterestButton) {
      this.selectedInterestButton.classList.remove('selected');
      this.selectedInterestButton = null;
    }
    this.initChart();
  }
  navigateToHome() {
    this.router.navigate(['']);
  }
}
