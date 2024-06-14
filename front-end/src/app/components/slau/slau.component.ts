import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
  ViewChildren,
  AfterViewChecked,
  QueryList,
  HostBinding,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { gsap } from 'gsap';
import { CalculationHistoryService } from 'src/app/services/calculation-history.service';
@Component({
  selector: 'app-slau',
  templateUrl: './slau.component.html',
  styleUrls: ['./slau.component.css'],
})
export class SlauComponent implements AfterViewChecked {
  constructor(
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService,
    private calculationHistoryService: CalculationHistoryService
  ) {}
  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  @ViewChildren('resultInput') resultInputs!: QueryList<ElementRef>;
  @ViewChild('highlight', { static: false }) highlight!: ElementRef;
  @HostBinding('style.color') color: string = 'white';
  counter = 2;
  selectedButton: string = 'Java';
  selectedThread: string = '1';
  previousThread: string = '1';
  highlightPosition = 0;
  serverResponse: string = '';
  time: string = '0.0';
  history: any[] = [];
  equations = Array.from({ length: this.counter }, () =>
    Array(this.counter).fill(0)
  );
  variables = Array(this.counter).fill(0);
  results = Array(this.counter).fill(0);
  ngAfterViewChecked() {
    // this.adjustBracketSize(this.leftBracket);
  }
  toggleHistory(event: MouseEvent) {
    event.stopPropagation();
    this.calculationHistoryService.toggleHistory();
  }
  selectThread(thread: string) {
    const threadButton = document.querySelector(
      `button[data-thread="${thread}"]`
    ) as HTMLElement;
    if (threadButton) {
      this.highlightPosition = threadButton.offsetLeft;
    }
    this.selectedThread = thread;
  }
  adjustBracketSize(bracket: ElementRef) {
    if (this.equations && this.equations.length > 0) {
      const rowCount = this.equations.length;
      const fontSize = rowCount * 40; // Измените множитель, чтобы подогнать под нужный размер

      bracket.nativeElement.style.fontSize = `${fontSize}px`;
    }
  }
  decrement() {
    if (this.counter > 2) {
      this.counter--;
      this.equations.pop();
      this.results.pop();
      this.equations.forEach((equation) => equation.pop());
      this.variables.pop();
    }
  }

  increment() {
    if (this.counter < 6) {
      this.counter++;
      this.equations.push(Array(this.counter).fill(0));
      this.results.push(0);
      this.equations.forEach((equation) => {
        if (equation.length < this.counter) {
          equation.push(0);
        }
      });
      this.variables.push(0);
    }
  }
  onFocus(i: number, j: number) {
    if (this.equations[i][j] === 0) {
      this.equations[i][j] = '';
    }
  }

  onBlur(i: number, j: number) {
    if (this.equations[i][j] === '') {
      this.equations[i][j] = 0;
    }
  }
  onFocusResult(i: number) {
    if (this.results[i] === 0) {
      this.results[i] = '';
    }
  }

  onBlurResult(i: number) {
    if (this.results[i] === '') {
      this.results[i] = 0;
    }
  }
  onEnter(i: number, j: number) {
    if (j < this.counter - 1) {
      // Если это не последний элемент в строке, перейдите к следующему элементу в этой же строке.
      this.focusInput(i, j + 1);
    } else {
      // Если это последний элемент в строке, перейдите к полю ввода для результатов этой строки.
      this.focusResultInput(i);
    }
  }

  focusInput(i: number, j: number) {
    // Получите ссылку на элемент input и вызовите метод focus.
    const inputIndex = i * this.counter + j;
    const inputElement = this.inputs.toArray()[inputIndex];
    if (inputElement) {
      inputElement.nativeElement.focus();
    }
  }

  focusResultInput(i: number) {
    // Получите ссылку на элемент input для результатов и вызовите метод focus.
    const inputElement = this.resultInputs.toArray()[i];
    if (inputElement) {
      inputElement.nativeElement.focus();
    }
  }

  onEnterResult(i: number) {
    if (i < this.counter - 1) {
      // Если это не последний результат, перейдите к первому элементу следующего уравнения.
      this.focusInput(i + 1, 0);
    } else {
      // Если это последний результат, перейдите к первому элементу первого уравнения.
      this.focusInput(0, 0);
    }
  }
  clearForm() {
    // Очистка всех полей ввода
    this.equations = [
      [0, 0],
      [0, 0],
    ];
    this.results = [0, 0];
    this.variables = [0, 0];
    this.counter = 2;
    // Очистка ответов от сервера
    this.serverResponse = '';
    this.time = '0.0';
    this.highlightPosition = 0;
    // Возвращение кнопок в начальное состояние
    this.selectedButton = 'Java';
    this.selectedThread = '1';
  }
  sendData() {
    const email = sessionStorage.getItem('email');
    const equationsString = this.equations
      .map((equation, index) => {
        return `{${equation.join(', ')} | ${this.results[index]}}`;
      })
      .join(', ');
    const data = {
      equations: equationsString,
      threads: this.selectedThread,
      email: email,
      library: this.selectedButton,
    };
    console.log(data);
    this.http
      .post<{ Result: string }>('http://localhost:8080/wolfram/slau', data)
      .subscribe((response) => {
        console.log(response);
        const [results, time] = response.Result.split(', Time: ');
        this.serverResponse = results
          .split(' ')
          .map((result, index) => `X${index + 1}=${Number(result).toFixed(2)}`)
          .join(', ');
        this.time = (parseFloat(time.split(' ')[0]) * Math.pow(10, 4)).toFixed(
          2
        );
      });
  }
  navigateToHome() {
    this.router.navigate(['']);
  }
}
