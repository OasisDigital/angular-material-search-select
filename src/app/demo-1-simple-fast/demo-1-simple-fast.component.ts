import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { delayWhen } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';

import { OptionEntry, DataSource } from '../obs-autocomplete/';
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

  displayValue(value: any): Observable<OptionEntry | null> {
    if (value === '333') {
      return of(null);
    }
    const display = value ? value + '!' : '';
    return of({
      value,
      display,
      details: {}
    });
  }

  search(term: string): Observable<OptionEntry[]> {
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
}