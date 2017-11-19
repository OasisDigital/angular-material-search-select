import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { OptionEntry } from '../obs-autocomplete/';
import { Company } from '../types';

declare global {
  interface Window {
    testData: any;
  }
}

const companies: Company[] = window.testData.companies;

@Component({
  selector: 'obs-demo-5-multi-column',
  templateUrl: './demo-5-multi-column.component.html',
  styles: []
})
export class Demo5MultiColumnComponent {
  ours = new FormControl(null, []);
  valueToDisplay1 = this.valueToDisplay.bind(this);
  searchFn1 = this.searchFn.bind(this);

  valueToDisplay(value: any): Observable<OptionEntry | null> {
    const company = companies.find((c: any) => c.id === parseInt(value || '', 10));
    if (company) {
      return of({
        value: company.id,
        display: company.name,
        details: {},
        match: true
      });
    }
    return of(null);
  }

  searchFn(term: string): Observable<OptionEntry[]> {
    const lowerTerm = typeof term === 'string' ? term.toLowerCase() : '';
    const result = companies
      .filter((c: any) => c.name.toLowerCase().indexOf(lowerTerm) >= 0)
      .slice(0, 200)
      .map((company: any) => ({
        value: company.id,
        display: company.name,
        details: company,
        match: company.name === term
      }));
    return of(result);
  }
}
