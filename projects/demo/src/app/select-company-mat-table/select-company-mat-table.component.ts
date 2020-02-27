import { DataSource } from '@angular/cdk/collections';
import {
  Component,
  Input,
  ViewEncapsulation,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter, map } from 'rxjs/operators';

import {
  OptionEntry,
  SearchSelectBase
} from '@oasisdigital/angular-material-search-select';

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
export class SelectCompanyMatGridComponent extends SearchSelectBase
  implements DataSource<OptionEntry> {
  @Input() placeholder = '';
  @Input() width = '';

  displayedColumns = ['name', 'city', 'state'];

  // For conciseness of implementation, the mat-table (CDK) DataSource is simply
  // implemented here, in the component class. A more complex component may need
  // to split out one or more data sources to separate classes.

  connect() {
    return this.list.pipe(
      filter(inputIsNotNullOrUndefined),
      map((optionEntries: OptionEntry[]) => optionEntries)
    );
  }

  disconnect() {}
}

function inputIsNotNullOrUndefined<T>(
  input: null | undefined | T
): input is T {
  return input !== null && input !== undefined;
}
