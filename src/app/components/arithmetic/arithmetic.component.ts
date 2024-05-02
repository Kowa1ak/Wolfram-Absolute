import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-arithmetic',
  templateUrl: './arithmetic.component.html',
  styleUrls: ['./arithmetic.component.css'],
})
export class ArithmeticComponent implements OnInit {
  form!: FormGroup;
  @ViewChild('inputArithmetic', { static: false }) inputArithmetic!: ElementRef;
  @ViewChild('btnLibrary', { static: false }) btnLibrary!: ElementRef;
  @ViewChild('btnThread', { static: false }) btnThread!: ElementRef;
  @ViewChild('image', { static: false }) image!: ElementRef;
  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private msgService: MessageService
  ) {}
  ngOnInit() {
    this.form = this.formBuilder.group({
      inputArithmetic: new FormControl(''),
    });
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
  serverResponse: string | null = null;
  sendData() {
    const email = sessionStorage.getItem('email');
    const data = {
      email: email,
      expression: this.form.get('inputArithmetic')?.value,
      library: this.selectedLibrary,
      threads: this.selectedThread,
    };

    this.http
      .post<{ Result: string }>('http://localhost:8080/wolfram/basic', data)
      .subscribe((response) => {
        console.log(response);
        this.serverResponse = response.Result;
      });
  }

  navigateToHome() {
    this.router.navigate(['']);
  }
  funcs = [
    'sin',
    'cos',
    'tan',
    'ctg',
    'abs',
    'acos',
    'asin',
    'atan',
    'cbrt',
    'ceil',
    'cosh',
    'exp',
    'floor',
    'log',
    'log10',
    'log2',
    'sinh',
    'sqrt',
    'tanh',
    'signum',
  ];
  funcDescriptions = {
    sin: 'Синус',
    cos: 'Косинус',
    tan: 'Тангенс',
    ctg: 'Котангенс',
    abs: 'Абсолютное значение',
    acos: 'Арккосинус',
    asin: 'Арксинус',
    atan: 'Арктангенс',
    cbrt: 'Кубический корень',
    ceil: 'Округление вверх',
    cosh: 'Гиперболический косинус',
    exp: 'Экспонента',
    floor: 'Округление вниз',
    log: 'Натуральный логарифм',
    log10: 'Десятичный логарифм',
    log2: 'Логарифм по основанию 2',
    sinh: 'Гиперболический синус',
    sqrt: 'Квадратный корень',
    tanh: 'Гиперболический тангенс',
    signum: 'Знак числа',
  };
  showLibraryList = false;
  isFunctionsVisible = false;
  showThreadList = false;
  threads = [1, 2, 3, 4];

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
  selectedThread: number = this.threads[0];
  selectThread(thread: number) {
    console.log(`Selected library: ${thread}`);
    this.selectedThread = thread;
    this.showThreadList = false;
    this.btnThread.nativeElement.style.borderBottomLeftRadius = '15px';
    this.btnThread.nativeElement.style.borderBottomRightRadius = '15px';
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
  selectedLibrary: string = 'library';
  selectLibrary(library: string) {
    console.log(`Selected library: ${library}`);
    this.showLibraryList = false;
    this.selectedLibrary = library;
    this.btnLibrary.nativeElement.style.borderBottomLeftRadius = '15px';
    this.btnLibrary.nativeElement.style.borderBottomRightRadius = '15px';
    const additionalButtons = document.querySelector(
      '.additional-buttons'
    ) as HTMLElement;
    if (additionalButtons) {
      additionalButtons.style.marginRight = '200px';
    }
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
  private history: string[] = [];
  private redoStack: string[] = [];

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
  ngAfterViewInit() {
    this.image.nativeElement.onmouseover = () => {
      this.inputArithmetic.nativeElement.style.transform = 'scale(1.1)';
      this.image.nativeElement.style.transform = 'scale(1.1)';
    };

    this.image.nativeElement.onmouseout = () => {
      this.inputArithmetic.nativeElement.style.transform = 'scale(1)';
      this.image.nativeElement.style.transform = 'scale(1)';
    };
  }
}
