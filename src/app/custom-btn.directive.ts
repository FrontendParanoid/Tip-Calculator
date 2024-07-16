import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  Renderer2,
} from '@angular/core';

import { EventEmitter } from '@angular/core';

@Directive({
  selector: '[appCustomBtn]',
  standalone: true,
})
export class CustomBtnDirective {
  Parent!: HTMLElement | null;
  Input!: HTMLInputElement;
  constructor(private element: ElementRef, private renderer: Renderer2) {}

  @Output() CustomInputChange = new EventEmitter();

  @HostListener('click', ['$event']) ChangeEl(event: MouseEvent) {
    const currEl = this.element.nativeElement as HTMLButtonElement;
    const parrEl = currEl.parentElement;
    const newEl = this.renderer.createElement('input');
    this.Parent = parrEl;

    this.renderer.addClass(newEl, 'ClickClass');
    this.renderer.setAttribute(newEl, 'id', 'ClickID');
    this.renderer.insertBefore(parrEl, newEl, currEl);
    this.renderer.removeChild(parrEl, currEl);

    this.Input = newEl;
    this.Input.focus();

    this.renderer.listen(newEl, 'input', (event: Event) => {
      this.CustomInputChange.emit((event.target as HTMLInputElement).value);
    });
  }
}
