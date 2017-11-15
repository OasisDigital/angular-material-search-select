import { Component, Input, forwardRef, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { switchMap, startWith, catchError, map, filter, debounce, take } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { OptionEntry, SearchResult } from './types';
import { publishReplay } from 'rxjs/operators/publishReplay';
import { refCount } from 'rxjs/operators/refCount';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

// The CSS approach below is the documented "solution":
// https://github.com/angular/material2/issues/3810
// https://github.com/angular/material2/pull/7176

@Component({
  selector: 'obs-autocomplete',
  templateUrl: './obs-autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ],
  styles: [`
  .bigger-mat-ac.mat-autocomplete-panel {
     max-height: 500px !important;
     width: 400px;
     max-width: 400px !important;
  }
  .obs-mat-container {
    position: relative;
  }
  .obs-mat-container mat-spinner.obs-mat-spinner {
    position: absolute;
    right: 5px;
  }
  .ng-invalid.ng-touched > .obs-mat-container {
    color: #f44336 !important;
  }
  .ng-invalid.ng-touched > .obs-mat-container label {
    color: #f44336 !important;
  }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent implements ControlValueAccessor, OnDestroy {
  @Input() placeholder: string;
  @Input() debounceTime = 50;
  @Input() displayValueFn: (x: any) => Observable<string> = of;
  searchControl: FormControl = new FormControl();
  options: Observable<SearchResult>;
  incomingValues = new Subject<any>();
  private incomingValuesSub: Subscription;
  private outsideValue: any;
  private selectedValueSub: Subscription;
  private selectedValue: Observable<any>;

  @Input() searchFn: (x: string) => Observable<OptionEntry[]> = _s => of([]);

  constructor() {
    const searchResult = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounce(_x => timer(this.debounceTime)),
      // Typing into input sends simple strings,
      // selecting from Material Option list provides objects
      map(v => (typeof v === 'object') ? (v as OptionEntry).display : v),

      switchMap(v => {
        return this.searchFn(v).pipe(
          catchError(_err => of({ msg: 'You typed the secret key' })),
          startWith(undefined)
        );
      }),
      publishReplay(1),
      refCount()
    );
    this.options = searchResult;
    this.selectedValue = searchResult.pipe(
      filter(results => Array.isArray(results)),
      map((results: OptionEntry[]) => {
        const entry = results.find(option => option.match);
        if (entry) {
          return entry.value;
        }
      }),
      distinctUntilChanged(),
    );

    this.incomingValuesSub = this.incomingValues.pipe(
      switchMap(incomingVal => this.displayValueFn(incomingVal))
    )
      .subscribe(displayVal => {
        this.searchControl.setValue(displayVal);
      });
  }

  focus() {
    this.selectedValueSub = this.selectedValue.subscribe(this.checkAndPropagate.bind(this));
  }

  blur() {
    this.onTouched();
    if (this.selectedValueSub) {
      this.selectedValueSub.unsubscribe();
    }
    setTimeout(() => {
      this.selectedValue.pipe(take(1)).subscribe(this.checkAndPropagate.bind(this));
    });
  }

  private checkAndPropagate(value: any) {
    if (value !== this.outsideValue) {
      this.onChange(value);
      this.outsideValue = value;
    }
  }

  displayWith(value: OptionEntry): string {
    return value.display;
  }

  writeValue(obj: any): void {
    this.outsideValue = obj;
    this.incomingValues.next(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }

  ngOnDestroy(): void {
    if (this.incomingValuesSub) {
      this.incomingValuesSub.unsubscribe();
    }
  }

  onChange = (_: any) => { };
  onTouched = () => { };

}
