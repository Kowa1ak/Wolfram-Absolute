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
import {
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-integral',
  templateUrl: './integral.component.html',
  styleUrls: ['./integral.component.css'],
})
export class IntegralComponent implements OnInit {
  form!: FormGroup;
  serverResponse: string = '';
  showLibraryList = false;
  isFunctionsVisible = false;
  showThreadList = false;
  equation: any;
  threads = [1, 2, 3, 4];
  selectedThread: number = this.threads[0];
  selectedLibrary: string = 'Java';
  private history: string[] = [];
  private redoStack: string[] = [];
  @ViewChild('inputArithmetic', { static: false }) inputArithmetic!: ElementRef;
  @ViewChild('initialCondition', { static: false })
  initialCondition!: ElementRef;
  @ViewChild('startTime', { static: false }) startTime!: ElementRef;
  @ViewChild('endTime', { static: false }) endTime!: ElementRef;
  @ViewChild('stepSize', { static: false }) stepSize!: ElementRef;
  @ViewChild('btnLibrary', { static: false }) btnLibrary!: ElementRef;
  @ViewChild('btnThread', { static: false }) btnThread!: ElementRef;
  @ViewChild('image', { static: false }) image!: ElementRef;
  funcs = [
    'sin',
    'cos',
    'tan',
    'ctg',
    'abs',
    'acos',
    'asin',
    'atan',
    'cosh',
    'log',
    'log10',
    'log2',
    'sinh',
    'sqrt',
    'tanh',
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private msgService: MessageService,
    private renderer: Renderer2,
    private calculationHistoryService: CalculationHistoryService
  ) {
    this.form = this.formBuilder.group({
      initialCondition: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      stepSize: ['', Validators.required],
    });
  }
  funcDescriptions = {
    sin: 'Синус',
    cos: 'Косинус',
    tan: 'Тангенс',
    ctg: 'Котангенс',
    abs: 'Абсолютное значение',
    acos: 'Арккосинус',
    asin: 'Арксинус',
    atan: 'Арктангенс',
    cosh: 'Гиперболический косинус',
    log: 'Натуральный логарифм',
    log10: 'Десятичный логарифм',
    log2: 'Логарифм по основанию 2',
    sinh: 'Гиперболический синус',
    sqrt: 'Квадратный корень',
    tanh: 'Гиперболический тангенс',
  };
  toggleHistory(event: MouseEvent) {
    event.stopPropagation();
    this.calculationHistoryService.toggleHistory();
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      inputArithmetic: new FormControl(''),
    });
  }
  ngAfterViewInit() {
    this.image.nativeElement.onmouseover = () => {
      this.image.nativeElement.style.transform = 'scale(1.1)';
    };

    this.image.nativeElement.onmouseout = () => {
      this.image.nativeElement.style.transform = 'scale(1)';
    };
  }
  errorShown = false;
  preventRussianCharacters(event: KeyboardEvent) {
    const russianRegex = /[а-яё]/i;
    if (russianRegex.test(event.key)) {
      event.preventDefault();
      if (!this.errorShown) {
        this.msgService.clear(); // Удаляем все текущие сообщения
        this.msgService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ввод русских символов запрещен',
        });
        this.errorShown = true;
        setTimeout(() => {
          this.errorShown = false;
        }, 3000); // Сбрасываем errorShown через 3 секунды
      }
    } else {
      this.errorShown = false;
    }
  }
  preventUpperCaseCharacters(event: KeyboardEvent) {
    const upperCaseRegex = /[A-Z]/;
    if (upperCaseRegex.test(event.key)) {
      event.preventDefault();
      if (!this.errorShown) {
        this.msgService.clear(); // Удаляем все текущие сообщения
        this.msgService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ввод символов в верхнем регистре запрещен',
        });
        this.errorShown = true;
        setTimeout(() => {
          this.errorShown = false;
        }, 3000); // Сбрасываем errorShown через 3 секунды
      }
    } else {
      this.errorShown = false;
    }
  }
  checkStepSize(value: number) {
    if (value <= 0 || value > 1) {
      if (!this.errorShown) {
        this.msgService.clear(); // Удаляем все текущие сообщения
        this.msgService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Размер шага должен быть больше 0 и не больше 1',
        });
        this.errorShown = true;
        setTimeout(() => {
          this.errorShown = false;
        }, 3000); // Сбрасываем errorShown через 3 секунды
      }
    } else {
      this.errorShown = false;
    }
  }
  toggleLibraryList() {
    if (this.showThreadList) {
      this.toggleThreadList();
    }
    if (this.isFunctionsVisible) {
      this.toggleFunctionList();
    }
    if (this.showLibraryList) {
      this.showLibraryList = false;
    } else {
      this.showLibraryList = true;
    }
    if (this.showLibraryList) {
      this.btnLibrary.nativeElement.style.borderBottomLeftRadius = '0';
      this.btnLibrary.nativeElement.style.borderBottomRightRadius = '0';
    } else {
      this.btnLibrary.nativeElement.style.borderBottomLeftRadius = '15px';
      this.btnLibrary.nativeElement.style.borderBottomRightRadius = '15px';
    }
  }
  toggleThreadList() {
    if (this.showLibraryList) {
      this.toggleLibraryList();
    }
    if (this.isFunctionsVisible) {
      this.toggleFunctionList();
    }
    if (this.showThreadList) {
      this.showThreadList = false;
    } else {
      this.showThreadList = true;
    }
    if (this.showThreadList) {
      this.btnThread.nativeElement.style.borderBottomLeftRadius = '0';
      this.btnThread.nativeElement.style.borderBottomRightRadius = '0';
    } else {
      this.btnThread.nativeElement.style.borderBottomLeftRadius = '15px';
      this.btnThread.nativeElement.style.borderBottomRightRadius = '15px';
    }
  }
  selectThread(thread: number) {
    console.log(`Selected library: ${thread}`);
    this.selectedThread = thread;
    this.showThreadList = false;
    this.btnThread.nativeElement.style.borderBottomLeftRadius = '15px';
    this.btnThread.nativeElement.style.borderBottomRightRadius = '15px';
  }
  selectLibrary(library: string) {
    console.log(`Selected library: ${library}`);
    this.showLibraryList = false;
    this.selectedLibrary = library;
    this.btnLibrary.nativeElement.style.borderBottomLeftRadius = '15px';
    this.btnLibrary.nativeElement.style.borderBottomRightRadius = '15px';
  }
  insertFunction(func: string) {
    const inputField = this.form.get('inputArithmetic')!;
    const currentValue = inputField.value;
    const cursorPosition = this.inputArithmetic.nativeElement.selectionStart;

    const newValue =
      currentValue.slice(0, cursorPosition) +
      func +
      '()' +
      currentValue.slice(cursorPosition);
    inputField.setValue(newValue);

    setTimeout(() => {
      const newPosition = cursorPosition + func.length + 1; // 2 for the parentheses
      this.inputArithmetic.nativeElement.focus();
      this.inputArithmetic.nativeElement.setSelectionRange(
        newPosition,
        newPosition
      );
    });
  }
  handleBackspace(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      let cursorPosition = this.inputArithmetic.nativeElement.selectionStart;
      let text = this.form.get('inputArithmetic')!.value;

      // Создаем регулярное выражение, которое будет искать все функции, включая вложенные
      let regex = new RegExp(
        `\\b(${this.funcs.join('|')})\\(.*?\\)(?![a-zA-Z0-9])`,
        'g'
      );

      // Находим все функции в тексте
      let match;
      while ((match = regex.exec(text)) !== null) {
        let start = match.index;
        let end = start + match[0].length;

        // Проверяем, находится ли курсор внутри или сразу после функции
        if (cursorPosition > start && cursorPosition <= end) {
          // Удаляем функцию
          let newValue = text.slice(0, start) + text.slice(end);
          this.form.get('inputArithmetic')!.setValue(newValue);
          this.inputArithmetic.nativeElement.setSelectionRange(start, start);
          break;
        }
      }
    }
  }
  toggleHistoryList() {}

  toggleFunctionList() {
    if (this.showLibraryList) {
      this.toggleLibraryList();
    }
    if (this.showThreadList) {
      this.toggleThreadList();
    }
    if (this.isFunctionsVisible) {
      this.isFunctionsVisible = false;
    } else {
      this.isFunctionsVisible = true;
    }
  }
  handleInput(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'z') {
      this.undo();
    } else if (event.ctrlKey && event.key === 'y') {
      this.redo();
    } else if (event.key === 'Enter' || event.key === 'Backspace') {
      this.history.push(this.form.get('inputArithmetic')!.value);
      this.redoStack = [];
    }
  }
  undo() {
    if (this.history.length > 0) {
      const lastValue = this.history.pop();
      this.redoStack.push(this.form.get('inputArithmetic')!.value);
      this.form.get('inputArithmetic')!.setValue(lastValue);
    }
  }
  redo() {
    if (this.redoStack.length > 0) {
      const redoValue = this.redoStack.pop();
      this.history.push(this.form.get('inputArithmetic')!.value);
      this.form.get('inputArithmetic')!.setValue(redoValue);
    }
  }
  sendData() {
    const email = sessionStorage.getItem('email');
    const equation = this.form.get('inputArithmetic')?.value;

    // Добавляем префикс Math. перед каждой функцией
    const modifiedEquation = this.funcs.reduce((eq, func) => {
      const regex = new RegExp(`\\b${func}\\b`, 'g');
      return eq.replace(regex, `Math.${func}`);
    }, equation);
    const data = {
      email: email,
      equation: modifiedEquation,
      library: this.selectedLibrary,
      y0: this.initialCondition.nativeElement.value,
      t0: this.startTime.nativeElement.value,
      t1: this.endTime.nativeElement.value,
      stepSize: this.stepSize.nativeElement.value,
    };
    console.log(data);

    this.http
      .post<{ solution: string }>(
        'http://localhost:8080/wolfram/solveODE',
        data
      )
      .subscribe((response) => {
        console.log(response);
        let solution = response.solution;
        let parts = solution.split('is');
        let xPart = parts[0].replace('Solution at ', '');
        let yPart = parts[1].replace('y = ', '');
        this.serverResponse = `${xPart}<br>y = ${yPart}`;
      });
  }
  clearForm() {
    this.inputArithmetic.nativeElement.value = '';
    this.selectedLibrary = 'Java';
    this.selectedThread = this.threads[0];
    this.initialCondition.nativeElement.value = '';
    this.startTime.nativeElement.value = '';
    this.endTime.nativeElement.value = '';
    this.stepSize.nativeElement.value = '';
    this.serverResponse = '';
  }
  navigateToHome() {
    this.router.navigate(['']);
  }
}
