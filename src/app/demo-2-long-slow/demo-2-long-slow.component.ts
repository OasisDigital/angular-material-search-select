import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of, throwError as _throw, timer } from 'rxjs';
import { delayWhen } from 'rxjs/operators';

import { OptionEntry, DataSource } from '../search-select/';

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
  ours = new FormControl(null, [Validators.required]);
  companyLimit = 10000;
  dataSource: DataSource;

  constructor() {
    this.updateDataSource();
  }

  swapSources() {
    this.companyLimit = this.companyLimit === 10000 ? 5 : 10000;
    this.updateDataSource();
  }

  updateDataSource() {
    // Here is another way to provide a data source. Create it as a literal
    // object wherever it is convenient to do so in the code.
    const companiesToSearch = companies.slice(0, this.companyLimit);
    const dataSource: DataSource = {
      displayValue(value: any): Observable<OptionEntry | null> {
        console.log('finding display value for', value);
        const id = Number(value);
        const company = companies.find((c: any) => c.id === id);
        if (company) {
          return of({
            value: company.id,
            display: company.name,
            details: {}
          });
        }
        return of(null);
      },

      search(term: string): Observable<OptionEntry[]> {
        console.log('searching for', term);
        if (term === 'error') {
          return _throw('testing');
        }
        const lowerTerm = typeof term === 'string' ? term.toLowerCase() : '';
        const result = companiesToSearch
          .filter((c: any) => c.name.toLowerCase().indexOf(lowerTerm) >= 0)
          .slice(0, 200)
          .map((company: any) => ({
            value: company.id,
            display: company.name
          }));
        return of(result).pipe(
          delayWhen(_event => timer(Math.random() * 1000 + 400)));
      }
    };
    this.dataSource = dataSource;
  }
}
