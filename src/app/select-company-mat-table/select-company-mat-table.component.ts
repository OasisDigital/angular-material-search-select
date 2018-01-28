import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';

import { SearchSelectBase, OptionEntry } from '../search-select/';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'obs-select-company-mat-table',
  templateUrl: './select-company-mat-table.component.html',
  styleUrls: ['./select-company-mat-table.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCompanyMatGridComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class SelectCompanyMatGridComponent extends SearchSelectBase implements DataSource<OptionEntry> {
  @Input() placeholder: string;
  @Input() width: string;

  displayedColumns = ['name', 'city', 'state'];

  // For conciseness of implementation, the mat-table (CDK) DataSource is simply
  // implemented here, in the component class. A more complex component may need
  // to split out one or more data sources to separate classes.

  connect() {
    return this.list.pipe(
      filter(list => !!list),
      map((optionEntries: OptionEntry[]) => optionEntries)
    );
  }

  disconnect() {

  }
}
