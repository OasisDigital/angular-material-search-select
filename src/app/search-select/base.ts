// Base class with which to create an observable auto complete. This doesn't
// have any connection to how the result is rendered in the Dom, with what
// component set, and so on.

import { Input, OnDestroy } from '@angular/core';
import { FormControl, ControlValueAccessor } from '@angular/forms';
import {
  Subscription, Observable, BehaviorSubject, of,
  EMPTY, timer, combineLatest, Subject
} from 'rxjs';
import {
  switchMap, startWith, catchError, map, filter,
  debounce, take, refCount, withLatestFrom,
  publishReplay, distinctUntilChanged
} from 'rxjs/operators';

import { OptionEntry, DataSource } from './types';

interface SearchResult {
  search: string;
  list?: OptionEntry[];
  errorMessage?: string;
}

export class SearchSelectBase implements ControlValueAccessor, OnDestroy {
  @Input() debounceTime = 75;
  @Input() set dataSource(ds: DataSource) { this.incomingDataSources.next(ds); }

  // API provided to client component (for use in its template)

  searchControl = new FormControl();
  loading: Observable<boolean>;
  list: Observable<OptionEntry[] | undefined>;
  empty: Observable<boolean>;
  errorMessage: Observable<string | undefined>;

  focus() {
    // While focused, user selection will be propagated to the form.
    this.selectedValueSub = this.selectedValue.subscribe(this.checkAndPropagate.bind(this));
  }

  blur() {
    this.onTouched();
    // Now that we've lost focus, stop propagating changes.
    if (this.selectedValueSub) {
      this.selectedValueSub.unsubscribe();
    }
    // However, it's possible the user has just typed some text that will be
    // confirmed (by the application provided function) as a match,
    // asynchronously. We can't force the system to wait for that to happen, we
    // are losing focus right now. But we can subscribe to pick up that one last
    // change and propagate it if/when it arrives.
    this.selectedValue
      .pipe(take(1))
      .subscribe(this.checkAndPropagate.bind(this));
    // However, this code raises an important question about valid behavior of a
    // Angular form control. Is it acceptable for a form control to
    // asynchronously provide a new value when it no longer has focus?
  }

  displayWith(value: OptionEntry): string {
    return value ? value.display : '';
  }

  // ---------------------------------------------------------------------
  // Internals
  // tslint:disable:member-ordering
  private incomingValues = new Subject<any>();
  private incomingDataSources = new BehaviorSubject<DataSource>({
    displayValue: of,
    search: () => of([])
  });

  private incomingDataSourcesSub: Subscription;
  private outsideValue: any;
  private selectedValueSub: Subscription;
  private selectedValue: Observable<any>;

  constructor() {
    const searches: Observable<OptionEntry | string | null> =
      this.searchControl.valueChanges.pipe(
        startWith(this.searchControl.value),
        distinctUntilChanged(),
        debounce(srch => {
          // Typing into input sends strings.
          if (typeof srch === 'string') {
            return timer(this.debounceTime);
          }
          return EMPTY; // immediate - no debounce for choosing from the list
        })
      );

    const options: Observable<SearchResult> = combineLatest(
      searches,
      this.incomingDataSources.pipe(filter(ds => !!ds)),
    ).pipe(
      switchMap(([srch, ds]) => {
        // Initial value is sometimes null.
        if (srch === null) {
          srch = '';
        }
        // Typing into input sends strings.
        if (typeof srch === 'string') {
          const search: string = srch;
          return ds.search(srch).pipe(
            map(list => ({ search, list })),
            catchError(errorMessage => of({ search, errorMessage })),
            startWith({ search })
          );
        }

        // Selecting from Material Option List sends an object, so there is
        // no need to call function to search for it.
        const entry = srch as OptionEntry;
        return of<SearchResult>({
          search: srch.display,
          list: [{ ...entry }]
        });
      }),
      publishReplay(1),
      refCount()
    );

    function matcher(search: string, entry: OptionEntry) {
      return entry.display === search;
    }

    this.selectedValue = options.pipe(
      filter(result => !!result.list),
      withLatestFrom(this.incomingDataSources),
      map(([result, ds]) => {
        const list = result.list || []; // appease TS
        const matchFn = ds.match || matcher;
        const entry = list.find(option => matchFn(result.search, option));
        return entry && entry.value || null;
      }),
      distinctUntilChanged()
    );

    this.loading = options.pipe(map(o => !o.list && !o.errorMessage));
    this.list = options.pipe(map(o => o.list));
    this.empty = options.pipe(map(o => o.list ? o.list.length === 0 : false));
    this.errorMessage = options.pipe(map(o => o.errorMessage));

    // a value was provided by the form; request the full entry
    this.incomingDataSourcesSub = this.incomingValues.pipe(
      withLatestFrom(this.incomingDataSources),
      switchMap<[any, DataSource], OptionEntry>(([value, ds]) => ds.displayValue(value))
    )
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
    if (this.incomingDataSourcesSub) {
      this.incomingDataSourcesSub.unsubscribe();
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
