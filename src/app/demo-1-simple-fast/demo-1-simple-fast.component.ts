import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { delayWhen } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';

import { OptionEntry } from '../obs-autocomplete/';
import { shortOptions } from '../short-options';

@Component({
  selector: 'obs-demo-1-simple-fast',
  templateUrl: './demo-1-simple-fast.component.html',
  styles: []
})
export class Demo1SimpleFastComponent {
  ours = new FormControl();
  disableMe = new FormControl();
  searchFn = this.search.bind(this);
  options = shortOptions;

  constructor() {
    this.disableMe.valueChanges.subscribe(dis =>
      dis ? this.ours.disable() : this.ours.enable())
  }

  valueToDisplay(value: any): Observable<OptionEntry> {
    const display = value ? value + '!' : '';
    return of({
      display,
      match: true,
      value
    });
  }

  search(term: string): Observable<OptionEntry[]> {
    if (term === 'error') {
      return _throw('testing');
    }
    return of(this.options
      .filter(option => option.display.toLowerCase().indexOf(term.toLowerCase()) >= 0)
      .map(option => ({ ...option, match: option.display === term }))
    ).pipe(delayWhen(_event =>
      timer(Math.random() * 300 + 100)
    ));
  }

}
