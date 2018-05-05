import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { OptionEntry, DataSource } from '../search-select/';
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
export class Demo5MultiColumnComponent implements DataSource {
  companyControl = new FormControl(null, []);

  displayValue(value: any): Observable<OptionEntry | null> {
    console.log('finding display value for', value);
    const company = companies.find((c: any) => c.id === parseInt(value || '', 10));
    if (company) {
      return of({
        value: company.id,
        display: company.name,
        details: {}
      });
    }
    return of(null);
  }

  search(term: string): Observable<OptionEntry[]> {
    console.log('searching for', term);
    const lowerTerm = typeof term === 'string' ? term.toLowerCase() : '';
    const result = companies
      .filter((c: any) => c.name.toLowerCase().indexOf(lowerTerm) >= 0)
      .slice(0, 200)
      .map((company: any) => ({
        value: company.id,
        display: company.name,
        details: company
      }));
    return of(result);
  }
}
