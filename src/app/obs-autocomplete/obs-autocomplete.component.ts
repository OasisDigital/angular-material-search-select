import { Component, Input, forwardRef, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { switchMap, startWith, catchError, map, filter, debounce, take, tap, refCount, scan } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { publishReplay } from 'rxjs/operators/publishReplay';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

import { OptionEntry, SearchFn, DisplayValueFn, SearchResult } from './types';

// The CSS approach below is the documented "solution":
// https://github.com/angular/material2/issues/3810
// https://github.com/angular/material2/pull/7176

// To set the width, style the first class something like this:
// width: 400px;
// max-width: 400px !important;
// ... need to figure out how to set the number programmaticlly.

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
  @Input() debounceTime = 100;
  @Input() width = '';
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
    this.incomingSearchFn.next(f);
  }

  constructor() {
    // Typing into input sends simple strings,
    // Initial value is sometimes null, and
    // selecting from Material Option list provides objects
    const searches: Observable<OptionEntry | string | null> =
      this.searchControl.valueChanges.pipe(
        startWith(this.searchControl.value),
        debounce(_x => timer(this.debounceTime))
      );

    this.options = combineLatest(
      searches,
      this.incomingSearchFn.pipe(filter(fn => !!fn)),
    ).pipe(
      switchMap(([search, fn]) => {
        if (search === null) {
          search = '';
        }
        if (typeof search === 'string') {
          return fn(search).pipe(
            map(list => ({ list })),
            catchError(errorMessage => of({ errorMessage })),
            startWith({})
          );
        }

        // No need to call function to search for it.
        const entry = search as OptionEntry;
        return of<SearchResult>({
          list: [{ ...entry, match: true }]
        });
      }),
      publishReplay(1),
      refCount()
      );

    this.selectedValue = this.options.pipe(
      filter(result => !!result.list),
      map(result => {
        const list = result.list || []; // appease TS
        const entry = list.find(option => option.match);
        return entry && entry.value || null;
      }),
      distinctUntilChanged()
    );

    // a value is provided from outside; request the full entry
    this.incomingValuesSub = this.incomingValues
      .pipe(switchMap<any, OptionEntry>(value => this.displayValueFn(value)))
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
    // Only send a change if there really is one.
    if (value !== this.outsideValue) {
      this.outsideValue = value;
      this.onChange(value);
    }
  }

  displayWith(value: OptionEntry): string {
    return value ? value.display : '';
  }

  writeValue(obj: any): void {
    // Angular sometimes writes a value that didn't really change.
    if (obj !== this.outsideValue) {
      this.outsideValue = obj;
      this.incomingValues.next(obj);
    }
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

// function kyle<T>(fn: (t: T) => T) {
//   return function (o: Observable<T>): Observable<T> {
//     return o;
//   };
// }
