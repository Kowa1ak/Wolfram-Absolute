import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms'; // добавьте этот импорт
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-arithmetic',
  templateUrl: './arithmetic.component.html',
  styleUrls: ['./arithmetic.component.css'],
})
export class ArithmeticComponent {
  form: FormGroup;
  @ViewChild('inputArithmetic', { static: false }) inputArithmetic!: ElementRef;
  @ViewChild('btnLibrary', { static: false }) btnLibrary!: ElementRef;
  @ViewChild('btnThread', { static: false }) btnThread!: ElementRef;
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private http: HttpClient
  ) {
    this.form = new FormGroup({
      inputArithmetic: new FormControl(''), // добавьте эту строку
    });
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
      const newPosition = cursorPosition + func.length + 1; // 1 for the opening parenthesis
      this.inputArithmetic.nativeElement.focus();
      this.inputArithmetic.nativeElement.setSelectionRange(
        newPosition,
        newPosition
      );
    });
  }

  handleBackspace(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      const currentValue = this.form.get('inputArithmetic')!.value;
      const cursorPosition = this.inputArithmetic.nativeElement.selectionStart;
      if (currentValue.slice(cursorPosition - 1, cursorPosition) === ')') {
        const regex = /(\w+\((?:[^()]*|\((?:[^()]*|\([^()]*\))*\))*\))/g;
        let match;
        let lastMatch;
        while (
          (match = regex.exec(currentValue.slice(0, cursorPosition))) !== null
        ) {
          lastMatch = match;
        }
        if (lastMatch) {
          this.form
            .get('inputArithmetic')!
            .setValue(
              currentValue.slice(0, lastMatch.index) +
                currentValue.slice(cursorPosition)
            );
        }
      } else {
        const lastOpenBracket = currentValue
          .slice(0, cursorPosition)
          .lastIndexOf('(');
        const lastCloseBracket = currentValue
          .slice(0, cursorPosition)
          .lastIndexOf(')');
        if (lastOpenBracket !== -1 && lastOpenBracket > lastCloseBracket) {
          this.form
            .get('inputArithmetic')!
            .setValue(
              currentValue.slice(0, lastOpenBracket) +
                currentValue.slice(cursorPosition)
            );
        } else if (lastOpenBracket !== -1) {
          const funcStart = currentValue
            .slice(0, lastOpenBracket)
            .search(/\W\w*$/);
          const correspondingClosingBracket = currentValue.indexOf(
            ')',
            cursorPosition
          );
          if (correspondingClosingBracket !== -1) {
            this.form
              .get('inputArithmetic')!
              .setValue(
                currentValue.slice(0, funcStart === -1 ? 0 : funcStart + 1) +
                  currentValue.slice(correspondingClosingBracket + 1)
              );
          }
        } else {
          this.form
            .get('inputArithmetic')!
            .setValue(
              currentValue.slice(0, cursorPosition - 1) +
                currentValue.slice(cursorPosition)
            );
        }
      }
    }
  }

  findLastFunction(str: string, pos: number) {
    let lastFuncPos = -1;
    this.funcs.forEach((func) => {
      const funcPos = str.lastIndexOf(func, pos);
      if (funcPos !== -1 && (lastFuncPos === -1 || funcPos > lastFuncPos)) {
        lastFuncPos = funcPos;
      }
    });
    return lastFuncPos;
  }
}
