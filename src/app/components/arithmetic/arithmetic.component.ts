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

  toggleLibraryList() {
    this.showLibraryList = !this.showLibraryList;
  }
  toggleThreadList() {}

  toggleHistoryList() {}

  toggleFunctionList() {
    this.isFunctionsVisible = !this.isFunctionsVisible;
  }

  selectLibrary(library: string) {
    console.log(`Selected library: ${library}`);
    this.showLibraryList = false;
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
