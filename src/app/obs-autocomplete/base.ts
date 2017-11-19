// Base class with which to create an observable auto complete. This doesn't
// have any connection to how the result is rendered in the Dom, with what
// component set, and so on.

import { Input, OnDestroy } from '@angular/core';
import { FormControl, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { switchMap, startWith, catchError, map, filter, debounce, take, refCount } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { publishReplay } from 'rxjs/operators/publishReplay';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

import { OptionEntry, SearchFn, DisplayValueFn, SearchResult } from './types';

export class ObsAutocompleteBase implements ControlValueAccessor, OnDestroy {
  @Input() debounceTime = 100;
  @Input() displayValueFn: DisplayValueFn = of;
  @Input() set searchFn(f: SearchFn) { this.incomingSearchFn.next(f); }

  // API provided to client component (for use in its template)

  searchControl = new FormControl();
  loading: Observable<boolean>;
  list: Observable<OptionEntry[] | undefined>;
  errorMessage: Observable<string | undefined>;

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

  displayWith(value: OptionEntry): string {
    return value ? value.display : '';
  }

  // ---------------------------------------------------------------------
  // Internals
  // tslint:disable:member-ordering
  private incomingValues = new Subject<any>();
  private incomingSearchFn = new BehaviorSubject<SearchFn>(() => of([]));
  private incomingValuesSub: Subscription;
  private outsideValue: any;
  private selectedValueSub: Subscription;
  private selectedValue: Observable<any>;

  constructor() {
    // Typing into input sends simple strings,
    // Initial value is sometimes null, and
    // selecting from Material Option list provides objects
    const searches: Observable<OptionEntry | string | null> =
      this.searchControl.valueChanges.pipe(
        startWith(this.searchControl.value),
        debounce(_x => timer(this.debounceTime))
      );

    const options: Observable<SearchResult> = combineLatest(
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

    this.selectedValue = options.pipe(
      filter(result => !!result.list),
      map(result => {
        const list = result.list || []; // appease TS
        const entry = list.find(option => option.match);
        return entry && entry.value || null;
      }),
      distinctUntilChanged()
    );

    this.loading = options.pipe(map(o => !o.list && !o.errorMessage));
    this.list = options.pipe(map(o => o.list));
    this.errorMessage = options.pipe(map(o => o.errorMessage));

    // a value is provided from outside; request the full entry
    this.incomingValuesSub = this.incomingValues
      .pipe(switchMap<any, OptionEntry>(value => this.displayValueFn(value)))
      .subscribe(value => this.searchControl.setValue(value));
  }

  // Implement ControlValueAccessor

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

  private onChange = (_: any) => { };
  private onTouched = () => { };

  private checkAndPropagate(value: any) {
    // Only send a change if there really is one.
    if (value !== this.outsideValue) {
      this.outsideValue = value;
      this.onChange(value);
    }
  }
}
