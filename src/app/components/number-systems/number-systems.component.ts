import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { CalculationHistoryService } from 'src/app/services/calculation-history.service';
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
  selector: 'app-number-systems',
  templateUrl: './number-systems.component.html',
  styleUrls: ['./number-systems.component.css'],
})
export class NumberSystemsComponent implements OnInit {
  @ViewChild('image', { static: false }) image!: ElementRef;
  @ViewChild('inputNumberSystems', { static: false })
  inputNumberSystems!: ElementRef;
  form!: FormGroup;
  selectedButton: string = 'Java';
  base1: string = '';
  base2: string = '';
  serverResponse: string | null = null;
  public errorOccurred = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private calculationHistoryService: CalculationHistoryService
  ) {}
  toggleHistory(event: MouseEvent) {
    event.stopPropagation();
    this.calculationHistoryService.toggleHistory();
  }
  navigateToHome() {
    this.router.navigate(['']);
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      inputNumberSystems: new FormControl(''),
    });
  }
  ngAfterViewInit() {
    this.image.nativeElement.onmouseover = () => {
      this.inputNumberSystems.nativeElement.style.transform = 'scale(1.02)';
      this.image.nativeElement.style.transform = 'scale(1.05)';
    };

    this.image.nativeElement.onmouseout = () => {
      this.inputNumberSystems.nativeElement.style.transform = 'scale(1)';
      this.image.nativeElement.style.transform = 'scale(1)';
    };
  }
  isValidNumber(number: string, base: number): boolean {
    const maxDigit = Math.max(
      ...number.split('').map((digit) => parseInt(digit, base))
    );
    return maxDigit < base;
  }
  sendData() {
    this.serverResponse = '';
    this.errorOccurred = false;
    const email = sessionStorage.getItem('email');
    const num = this.form.get('inputNumberSystems')?.value;
    const data = {
      email: email,
      number: num,
      library: 'Java',
      base1: this.base1,
      base2: this.base2,
    };
    const base1Number = parseInt(this.base1, 10);
    if (!this.base1 || !this.base2) {
      setTimeout(() => (this.errorOccurred = true), 10);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Number systems not selected',
      });
      return;
    }
    if (!num || num.trim() === '') {
      setTimeout(() => (this.errorOccurred = true), 10);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Input cannot be empty',
      });
      return;
    }
    if (!this.isValidNumber(num, base1Number)) {
      setTimeout(() => (this.errorOccurred = true), 10);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The number is not valid for the selected number system',
      });
      return;
    }
    this.http
      .post<{ Result: string }>('http://localhost:8080/wolfram/converter', data)
      .subscribe((response) => {
        console.log(response);
        this.serverResponse = response.Result;
      });
  }
}
