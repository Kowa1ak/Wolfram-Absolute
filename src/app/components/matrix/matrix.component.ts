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

import {
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css'],
})
export class MatrixComponent implements AfterViewChecked {
  @ViewChild('leftBracket', { static: false }) leftBracket!: ElementRef;
  @ViewChild('rightBracket', { static: false }) rightBracket!: ElementRef;
  @ViewChild('leftBracket2', { static: false }) leftBracket2!: ElementRef;
  @ViewChild('rightBracket2', { static: false }) rightBracket2!: ElementRef;
  @ViewChild('leftBracket3', { static: false }) leftBracket3!: ElementRef;
  @ViewChild('rightBracket3', { static: false }) rightBracket3!: ElementRef;
  @ViewChild('highlight', { static: false }) highlight!: ElementRef;
  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  @HostBinding('style.color') color: string = 'white';
  isModalOpen = false;
  gridItems = Array(25);
  hoverIndex = -1;
  gridSize = 5;
  selectedMatrix: { value: string }[][][] = [];
  currentOperation: string = '';

  firstMatrixAdded = false;
  operationSelected = false;
  currentMatrixIndex: number = 0;
  isMatrixAdded: boolean = false;
  public errorOccurred = false;
  isInputContainerVisible = true;
  secondMatrixAdded = false;
  selectedButton: string = 'Java';
  selectedThread: string = '1';
  previousThread: string = '1';
  highlightPosition = 5;
  operationsContainerVisible: boolean = true;
  operationMappings: { [key: string]: string } = {
    '*': 'matrix_multiply',
    '-1': 'matrix_find_inverse',
    T: 'matrix_transpose',
    '+': 'matrix_sum',
  };
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private renderer: Renderer2
  ) {}

  ngAfterViewChecked() {
    this.adjustBracketSize(
      this.selectedMatrix[0],
      this.leftBracket,
      this.rightBracket
    );
    this.adjustBracketSize(
      this.selectedMatrix[1],
      this.leftBracket2,
      this.rightBracket2
    );
    this.adjustBracketSize(
      this.serverResponse,
      this.leftBracket3,
      this.rightBracket3
    );
  }

  selectThread(thread: string) {
    const threadButton = document.querySelector(
      `button[data-thread="${thread}"]`
    ) as HTMLElement;
    if (threadButton) {
      this.highlightPosition = threadButton.offsetTop;
    }
    this.selectedThread = thread;
  }

  animateTransition(previousThread: string, nextThread: string) {
    const previousButton = document.querySelector(
      `button[data-thread="${previousThread}"]`
    );
    const nextButton = document.querySelector(
      `button[data-thread="${nextThread}"]`
    );

    gsap.to(previousButton, { scale: 1, duration: 0.3 });
    gsap.to(nextButton, { scale: 1.2, duration: 0.3 });
  }
  adjustBracketSize(
    matrix: any[],
    leftBracket: ElementRef,
    rightBracket: ElementRef
  ) {
    if (matrix && matrix.length > 0) {
      const rowCount = matrix.length;
      const fontSize = rowCount * 50; // Измените множитель, чтобы подогнать под нужный размер

      this.renderer.setStyle(
        leftBracket.nativeElement,
        'font-size',
        `${fontSize}px`
      );
      this.renderer.setStyle(
        rightBracket.nativeElement,
        'font-size',
        `${fontSize}px`
      );
    }
  }
  onMouseEnter(index: number) {
    this.hoverIndex = index;
  }

  onMouseLeave() {
    this.hoverIndex = -1;
  }

  isHighlighted(index: number) {
    const currentRow = Math.floor(this.hoverIndex / this.gridSize);
    const currentColumn = this.hoverIndex % this.gridSize;
    const row = Math.floor(index / this.gridSize);
    const column = index % this.gridSize;
    return row <= currentRow && column <= currentColumn;
  }
  selectMatrixSize(index: number) {
    if (this.selectedMatrix.length >= 2) {
      this.showError('Вы не можете добавить больше двух матриц');
      return;
    }
    if (this.selectedMatrix.length === 0) {
      this.firstMatrixAdded = true;
    } else if (this.selectedMatrix.length === 1 && !this.operationSelected) {
      this.showError('Выберите операцию перед добавлением второй матрицы');
      return;
    }
    if (this.selectedMatrix.length === 1) {
      this.secondMatrixAdded = true;
    }
    if (this.currentOperation === '-1' || this.currentOperation === 'T') {
      this.showError(
        'Нельзя добавить вторую матрицу при выборе операции "-1" или "T"'
      );
      return;
    }
    this.isMatrixAdded = true;
    const rows = Math.floor(index / this.gridSize) + 1;
    const columns = (index % this.gridSize) + 1;
    const newMatrix = Array.from({ length: rows }, (_, i) =>
      Array.from({ length: columns }, (_, j) => ({ value: '' }))
    );

    this.selectedMatrix.push(newMatrix);

    this.currentMatrixIndex++;
    this.isModalOpen = false;
    let firstInputIndexInSecondMatrix = 0;
    if (this.selectedMatrix.length > 1) {
      firstInputIndexInSecondMatrix =
        this.selectedMatrix[0].length * this.selectedMatrix[0][0].length;
    }
    setTimeout(
      () =>
        this.inputs
          .toArray()
          [firstInputIndexInSecondMatrix].nativeElement.focus(),
      0
    );
  }
  openModal() {
    if (this.selectedMatrix.length >= 2) {
      this.showError('Вы не можете добавить больше двух матриц');
      return;
    }
    if (this.selectedMatrix.length > 0 && !this.operationSelected) {
      this.showError('Выберите операцию перед добавлением второй матрицы');
      return;
    }
    if (this.currentOperation === '-1' || this.currentOperation === 'T') {
      this.showError(
        'Нельзя добавить вторую матрицу при выборе операции "-1" или "T"'
      );
      return;
    }
    this.isModalOpen = true;
  }
  focusNextInput(matrixIndex: number, i: number, j: number) {
    let previousElements = 0;
    for (let index = 0; index < matrixIndex; index++) {
      previousElements +=
        this.selectedMatrix[index].length *
        this.selectedMatrix[index][0].length;
    }
    const nextInputIndex =
      previousElements + this.selectedMatrix[matrixIndex][i].length * i + j + 1;
    if (nextInputIndex < this.inputs.length) {
      this.inputs.toArray()[nextInputIndex].nativeElement.focus();
    }
  }
  add(): void {
    this.operationSelected = true;

    if (!this.isMatrixAdded) {
      this.showError('Матрица не выбрана');
      return;
    }
    // Проверка, что все матрицы имеют одинаковый размер
    const rows = this.selectedMatrix[0].length;
    const cols = this.selectedMatrix[0][0].length;

    for (let i = 1; i < this.selectedMatrix.length; i++) {
      if (
        this.selectedMatrix[i].length !== rows ||
        this.selectedMatrix[i][0].length !== cols
      ) {
        this.showError(
          'Все матрицы должны быть одного и того же размера для операции сложения'
        );
        return;
      }
    }

    this.currentOperation = '+';
  }

  multiply(): void {
    this.operationSelected = true;
    if (!this.isMatrixAdded) {
      this.showError('Матрица не выбрана');
      return;
    }

    this.currentOperation = '*';
  }

  inverse(): void {
    this.operationSelected = true;
    if (!this.isMatrixAdded) {
      this.showError('Матрица не выбрана');
      return;
    }

    // Проверить, является ли матрица обратимой (определитель не равен нулю)
    this.selectedMatrix.forEach((matrix, index) => {
      if (matrix.length !== matrix[0].length) {
        this.showError(
          `Матрица номер ${
            index + 1
          } должна быть квадратной для операции обратной матрицы`
        );
        return;
      }

      let numericMatrix = matrix.map((row) =>
        row.map((cell) => parseFloat(cell.value))
      );
      if (this.determinant(numericMatrix) === 0) {
        this.showError(
          `Матрица номер ${
            index + 1
          } должна быть обратимой (ее определитель не должен быть равен нулю)`
        );
        return;
      }
    });

    this.currentOperation = '-1';
  }
  determinant(matrix: number[][]): number {
    const size = matrix.length;
    let det = 0;

    if (size === 1) {
      return matrix[0][0];
    }

    if (size === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    for (let i = 0; i < size; i++) {
      // Создать подматрицу, исключив первую строку и i-й столбец
      const subMatrix = matrix
        .slice(1)
        .map((row) => row.filter((_, idx) => idx !== i));

      // Рекурсивно вычислить определитель подматрицы и добавить его к общему определителю
      det += Math.pow(-1, i) * matrix[0][i] * this.determinant(subMatrix);
    }

    return det;
  }

  transpose(): void {
    this.operationSelected = true;
    if (!this.isMatrixAdded) {
      this.showError('Матрица не выбрана');
      return;
    }

    this.currentOperation = 'T';
  }
  showError(detail: string): void {
    setTimeout(() => (this.errorOccurred = true), 10);
    this.messageService.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: detail,
    });
  }
  serverResponse: number[][] = [];
  sendData() {
    this.errorOccurred = false;
    const email = sessionStorage.getItem('email');
    const serverOperation = this.operationMappings[this.currentOperation];
    const data = {
      matrix1: this.selectedMatrix[0]
        .map(
          (innerArray) => `{${innerArray.map((obj) => obj.value).join(', ')}}`
        )
        .join(', '),
      matrix2: this.selectedMatrix[1]
        ? this.selectedMatrix[1]
            .map(
              (innerArray) =>
                `{${innerArray.map((obj) => obj.value).join(', ')}}`
            )
            .join(', ')
        : '',
      library: this.selectedButton,
      threads: this.selectedThread,
      email: email,
    };
    console.log(data);
    this.http
      .post<{ Result: string }>(
        'http://localhost:8080/wolfram/' + serverOperation,
        data
      )
      .subscribe(
        (response) => {
          console.log('Server response:', response);
          this.serverResponse = response.Result.slice(1, -1)
            .split('}, {')
            .map((row) => row.split(', ').map(Number))
            .map((row) => row.map((num) => parseFloat(num.toFixed(1))));
          this.adjustBracketSize(
            this.serverResponse,
            this.leftBracket3,
            this.rightBracket3
          );
          console.log('Parsed server response:', this.serverResponse);
        },
        (error) => {
          this.showError('Произошла ошибка при обработке вашего запроса');
        }
      );
    const rows = this.selectedMatrix[0].length;
    const cols = this.selectedMatrix[0][0].length;

    if (this.currentOperation === '+') {
      // Проверка для операции сложения
      for (let i = 1; i < this.selectedMatrix.length; i++) {
        if (
          this.selectedMatrix[i].length !== rows ||
          this.selectedMatrix[i][0].length !== cols
        ) {
          this.showError(
            'Все матрицы должны быть одного и того же размера для операции сложения'
          );
          return;
        }
      }
    } else if (this.currentOperation === '*') {
      // Проверка для операции умножения
      for (let i = 1; i < this.selectedMatrix.length; i++) {
        if (
          this.selectedMatrix[i - 1][0].length !== this.selectedMatrix[i].length
        ) {
          this.showError(
            'Количество столбцов первой матрицы должно быть равно количеству строк второй матрицы для операции умножения'
          );
          return;
        }
      }
    }
  }
  handleServerResponse(serverResponse: string) {
    let responseObj = JSON.parse(serverResponse);

    let resultMatrix = JSON.parse(responseObj.Result);

    for (let i = 0; i < resultMatrix.length; i++) {
      for (let j = 0; j < resultMatrix[i].length; j++) {
        resultMatrix[i][j] = parseFloat(resultMatrix[i][j].toFixed(1));
      }
    }

    responseObj.Result = JSON.stringify(resultMatrix);
    return responseObj;
  }
  deleteAllAndClose() {
    // удалить все данные
    this.selectedMatrix = [];
    this.serverResponse = [];
    this.operationSelected = false;
    this.currentOperation = '';
    this.firstMatrixAdded = false;
    this.secondMatrixAdded = false;
  }

  navigateToHome() {
    this.router.navigate(['']);
  }
}
