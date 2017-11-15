import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { delayWhen } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';

import { OptionEntry } from '../obs-autocomplete/';

@Component({
  selector: 'obs-demo-2-long-slow',
  templateUrl: './demo-2-long-slow.component.html'
})
export class Demo2LongSlowComponent {
  ours: FormControl = new FormControl();
  searchFn = this.search.bind(this);

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
    const result =
      window['testData'].companies
        .filter(option => option.name.toLowerCase().indexOf(term.toLowerCase()) >= 0)
        .slice(0, 200)
        .map(option => ({
          value: option.id,
          display: option.name,
          match: option.display === term
        }));
    return of(result).pipe(delayWhen(_event =>
      timer(Math.random() * 1000 + 400)
    ));
  }
}
