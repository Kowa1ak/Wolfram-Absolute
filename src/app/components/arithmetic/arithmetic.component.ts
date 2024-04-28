import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms'; // добавьте этот импорт

@Component({
  selector: 'app-arithmetic',
  templateUrl: './arithmetic.component.html',
  styleUrls: ['./arithmetic.component.css'],
})
export class ArithmeticComponent {
  form: FormGroup; // добавьте эту строку
  @ViewChild('inputArithmetic', { static: false }) inputArithmetic!: ElementRef;
  @ViewChild('btnLibrary', { static: false }) btnLibrary!: ElementRef;
  @ViewChild('btnThread', { static: false }) btnThread!: ElementRef;
  constructor(private router: Router, private ngZone: NgZone) {
    this.form = new FormGroup({
      inputArithmetic: new FormControl(''), // добавьте эту строку
    });
  }

  navigateToHome() {
    this.router.navigate(['']);
  }
  funcs = ['sin', 'cos', 'tan', 'ctg'];
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
      additionalButtons.style.marginRight = '220px';
    }
  }
  insertFunction(func: string) {
    const currentValue = this.form.get('inputArithmetic')!.value;
    this.form.get('inputArithmetic')!.setValue(currentValue + func + '()');
    setTimeout(() => {
      const newPosition = currentValue.length + func.length + 1;
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
      if (
        currentValue.slice(cursorPosition - 1, cursorPosition) === '(' ||
        currentValue.slice(cursorPosition - 1, cursorPosition) === ')'
      ) {
        const funcEnd = this.findLastFunction(currentValue, cursorPosition);
        if (funcEnd !== -1) {
          this.form
            .get('inputArithmetic')!
            .setValue(currentValue.slice(0, funcEnd));
          event.preventDefault();
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
