import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
  ViewChildren,
  AfterViewChecked,
  QueryList,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
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
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css'],
})
export class MatrixComponent implements AfterViewChecked {
  @ViewChild('leftBracket', { static: false }) leftBracket!: ElementRef;
  @ViewChild('rightBracket', { static: false }) rightBracket!: ElementRef;
  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  isModalOpen = false;
  gridItems = Array(25);
  hoverIndex = -1;
  gridSize = 5;
  selectedMatrix: { value: string }[][] = [];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private renderer: Renderer2
  ) {}

  ngAfterViewChecked() {
    this.adjustBracketSize();
  }
  adjustBracketSize() {
    if (this.selectedMatrix && this.selectedMatrix.length > 0) {
      const rowCount = this.selectedMatrix.length;
      const fontSize = rowCount * 40; // Измените множитель, чтобы подогнать под нужный размер

      this.renderer.setStyle(
        this.leftBracket.nativeElement,
        'font-size',
        `${fontSize}px`
      );
      this.renderer.setStyle(
        this.rightBracket.nativeElement,
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
    const rows = Math.floor(index / this.gridSize) + 1;
    const columns = (index % this.gridSize) + 1;
    this.selectedMatrix = Array.from({ length: rows }, (_, i) =>
      Array.from({ length: columns }, (_, j) => ({ value: '' }))
    );
    this.isModalOpen = false;
    setTimeout(() => this.inputs.first.nativeElement.focus(), 0);
  }
  focusNextInput(i: number, j: number) {
    const nextInputIndex = this.selectedMatrix[0].length * i + j + 1;
    if (nextInputIndex < this.inputs.length) {
      this.inputs.toArray()[nextInputIndex].nativeElement.focus();
    }
  }
  navigateToHome() {
    this.router.navigate(['']);
  }
}
