import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, throwError as _throw, timer } from 'rxjs';
import { delayWhen } from 'rxjs/operators';

// Demo - import directly from sibling code
import { OptionEntry, DataSource } from '../search-select/';

// Real applications:
// import { OptionEntry, DataSource } from '@oasisdigital/angular-material-search-select/';

import { shortOptions } from '../short-options';

@Component({
  selector: 'obs-demo-1-simple-fast',
  templateUrl: './demo-1-simple-fast.component.html',
  styles: []
})
export class Demo1SimpleFastComponent implements DataSource {
  ours = new FormControl();
  disableMe = new FormControl();
  options = shortOptions;

  constructor() {
    this.disableMe.valueChanges.subscribe(dis =>
      dis ? this.ours.disable() : this.ours.enable());
  }

  // The simplest way to provide a DataSource to the search-select is
  // to have the application component (this example component you are reading
  // now) implement the DataSource interface, then (see the template) pass it as
  // [dataSource]="this". Of course this technique only works if you are using
  // a single search-select component.

  displayValue(value: any): Observable<OptionEntry | null> {
    console.log('finding display value for', value);
    if (value === '333') {
      return of(null);
    }
    if (value) {
      let display = '';
      value = parseInt(value, 10);
      for (const idx in this.options) {
        if (this.options[idx] && this.options[idx].value === value) {
          display = this.options[idx].display;
          break;
        }
      }
      return of({
        value,
        display,
        details: {}
      });
    } else {
      return of(null);
    }
  }

  search(term: string): Observable<OptionEntry[]> {
    console.log('searching for', term);
    if (term === 'error') {
      return _throw('testing');
    }
    const lowerTerm = typeof term === 'string' ? term.toLowerCase() : '';
    return of(this.options
      .filter(option => option.display.toLowerCase().indexOf(lowerTerm) >= 0)
    ).pipe(delayWhen(_event =>
      timer(Math.random() * 300 + 100)
    ));
  }

  // This custom match function makes it possible for the user to type "one" to
  // match an entry "One".

  match(search: string, entry: OptionEntry) {
    return entry.display && search.toLowerCase() === entry.display.toLowerCase() || false;
  }
}
