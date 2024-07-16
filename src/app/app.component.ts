import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomBtnDirective } from './custom-btn.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    CustomBtnDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  form: FormGroup = new FormGroup({});

  percentages: string[] = ['5%', '10%', '15%', '25%', '50%'];
  percentage: number = 5;
  bill: number = 0;
  nbPeople: number = 1;
  @ViewChild('tipAmountResVal') totalAmount!: ElementRef;
  @ViewChild('totalResVal') total!: ElementRef;
  @ViewChild('tip') tip!: ElementRef;
  @ViewChildren('checkbox') checkboxes!: QueryList<ElementRef>;
  customBox?: HTMLInputElement | null;

  constructor(
    private renderer: Renderer2,
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      billField: ['', [Validators.pattern('^[0-9]*$')]],
      numberPeopleField: ['', [Validators.pattern('^[1-9][0-9]*$')]],
    });
  }

  ngAfterViewInit(): void {
    this.customBox = this.document.getElementById(
      'ClickID'
    ) as HTMLInputElement;
    if (this.customBox) {
      this.customBox.addEventListener('input', (event: Event) => {
        const inputElement = event.target as HTMLInputElement;
        this.percentage = parseFloat(inputElement.value) || 0;
      });
    }
  }

  @HostListener('document:keyup', ['$event']) OnInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.customBox = this.document.getElementById(
        'ClickID'
      ) as HTMLInputElement;
      if (this.customBox !== null) {
        if (
          (this.customBox as HTMLInputElement).value == '' ||
          (this.customBox as HTMLInputElement).value == null
        ) {
          this.ClickAway();
          return;
        }
      }
    }

    let value: string | undefined = this.numberPeopleField?.value;
    if (value !== undefined && value !== null) {
      value = value.toString();
      if (!value.match(/^[1-9][0-9]*$/) || value == null) {
        this.numberPeopleField?.setErrors({ pattern: true });
      }
    } else {
      this.numberPeopleField?.setErrors({ pattern: true });
    }

    value = this.billField?.value;
    if (value !== undefined && value !== null) {
      value = value.toString();
      if (!value.match('^[0-9]*$') || value == null) {
        this.billField?.setErrors({ pattern: true });
      }
    } else {
      this.billField?.setErrors({ pattern: true });
    }
  }

  get billField() {
    return this.form.get('billField');
  }

  get numberPeopleField() {
    return this.form.get('numberPeopleField');
  }

  ClickAway() {
    const newEl: HTMLButtonElement = this.renderer.createElement('button');
    this.renderer.addClass(newEl, 'customBtn');
    newEl.toggleAttribute('appCustomButton');

    const text = this.renderer.createText('Custom');
    this.renderer.appendChild(newEl, text);

    const parent = this.document.getElementById('CustomButtonElement');
    parent?.removeChild(this.customBox as HTMLInputElement);
    parent?.appendChild(newEl);
  }

  OnCustomInput(value: string) {
    this.percentage = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
    this.calculation();
  }

  calculation() {
    const tipAmount = this.totalAmount.nativeElement as HTMLHeadElement;
    const total = this.total.nativeElement as HTMLHeadElement;
    let tip;

    tip = parseFloat(((this.bill * this.percentage) / 100).toFixed(2));

    if (this.nbPeople != 0 && this.nbPeople != null) {
      tipAmount.innerText = (tip / this.nbPeople).toFixed(2);
      total.innerText = (
        (parseFloat(tipAmount.innerText) * this.nbPeople + this.bill) /
        this.nbPeople
      )
        .toFixed(2)
        .toString();
    } else {
      tipAmount.innerText = '0.00';
      total.innerText = '0.00';
    }
    return;
  }

  hasChosen: boolean = false;
  Choose(id: number) {
    this.hasChosen = true;
    //Find a way to pass the value into the box
    if (id == 5) {
      this.percentage = parseInt(this.customBox!.value);
      return;
    }

    this.percentage = parseInt(this.percentages[id]);

    this.checkboxes.forEach((checkbox, index) => {
      if (index !== id) {
        (checkbox.nativeElement as HTMLInputElement).checked = false;
      }
    });

    this.calculation();
  }

  CustomPercentage(value: string) {
    this.percentage = parseFloat(value);
    this.calculation();
  }

  ResetForm() {
    this.form.reset();

    const tipAmount = this.totalAmount.nativeElement as HTMLHeadElement;
    const total = this.total.nativeElement as HTMLHeadElement;

    tipAmount.innerText = '0.00';
    total.innerText = '0.00';
  }
}
