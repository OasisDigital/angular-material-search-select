import { Component, Input, forwardRef, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { switchMap, startWith, catchError, map, filter, debounce, take, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { publishReplay } from 'rxjs/operators/publishReplay';
import { refCount } from 'rxjs/operators/refCount';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

import { OptionEntry, SearchResult, SearchFn, DisplayValueFn } from './types';

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
  @Input() displayValueFn: DisplayValueFn = of;
  searchControl = new FormControl();
  options: Observable<SearchResult>;
  incomingValues = new Subject<any>();
  incomingSearchFn = new BehaviorSubject<SearchFn>(() => of([]));
  private incomingValuesSub: Subscription;
  private outsideValue: any;
  private selectedValueSub: Subscription;
  private selectedValue: Observable<any>;

  @Input() set searchFn(f: SearchFn) {
    if (f) {
      this.incomingSearchFn.next(f);
    }
  }

  constructor() {
    const termValues = this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      debounce(_x => timer(this.debounceTime)),
      // Typing into input sends simple strings,
      // selecting from Material Option list provides objects
      map(v => v && (typeof v === 'object') ? (v as OptionEntry).display : v)
    );

    const searchResult = combineLatest(
      termValues,
      this.incomingSearchFn,
    ).pipe(
      switchMap(([term, fn]) => fn(term).pipe(
        catchError(_err => of({ msg: 'Error ' + _err })),
        startWith(null)
      )),
      publishReplay(1),
      refCount()
      );

    this.options = searchResult;
    this.selectedValue = searchResult.pipe(
      filter(results => Array.isArray(results)),
      map((results: OptionEntry[]) => {
        const entry = results.find(option => option.match);
        return entry && entry.value;
      }),
      distinctUntilChanged()
    );

    this.incomingValuesSub = this.incomingValues
      .pipe(switchMap(value => this.displayValueFn(value)))
      .subscribe(value => this.searchControl.setValue(value));
  }

  focus() {
    this.selectedValueSub = this.selectedValue.subscribe(this.checkAndPropagate.bind(this));
  }

  blur() {
    this.onTouched();
    if (this.selectedValueSub) {
      this.selectedValueSub.unsubscribe();
    }
    setTimeout(() =>
      this.selectedValue.pipe(take(1)).subscribe(this.checkAndPropagate.bind(this)));
  }

  private checkAndPropagate(value: any) {
    if (value !== this.outsideValue) {
      this.outsideValue = value;
      this.onChange(value);
    }
  }

  displayWith(value: OptionEntry): string {
    return value ? value.display : '';
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
