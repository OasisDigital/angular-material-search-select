import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { delayWhen } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';

import { OptionEntry } from '../obs-autocomplete/';

declare global {
  interface Window {
    testData: any;
  }
}

const companies = window.testData.companies;

@Component({
  selector: 'obs-demo-2-long-slow',
  templateUrl: './demo-2-long-slow.component.html'
})
export class Demo2LongSlowComponent {
  ours = new FormControl(undefined, [Validators.required]);
  reqExample = new FormControl(undefined, [Validators.required]);
  companyLimit = 10000;
  searchFn: any;

  constructor() {
    this.searchFn = this.makeSearchFn(this.companyLimit);
  }

  swapSources() {
    this.companyLimit = this.companyLimit === 10000 ? 5 : 10000;
    this.searchFn = this.makeSearchFn(this.companyLimit);
  }

  valueToDisplay(value: any): Observable<OptionEntry> {
    const company = companies.find((c: any) => c.id === value);
    if (company) {
      return of({
        value: company.id,
        display: company.name,
        match: true
      });
    }
    return of(undefined);
  }

  makeSearchFn(n: number) {
    const companiesToSearch = companies.slice(0, n);
    return (term: string): Observable<OptionEntry[]> => {
      if (term === 'error') {
        return _throw('testing');
      }
      const lowerTerm = typeof term === 'string' ? term.toLowerCase() : '';
      const result = companiesToSearch
        .filter((c: any) => c.name.toLowerCase().indexOf(lowerTerm) >= 0)
        .slice(0, 200)
        .map((company: any) => ({
          value: company.id,
          display: company.name,
          tip: 'But is this really ' + company.name + '?',
          match: company.name === term
        }));
      return of(result).pipe(
        delayWhen(_event => timer(Math.random() * 1000 + 400)));
    };
  }
}
