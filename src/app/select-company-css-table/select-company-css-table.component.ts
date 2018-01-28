import { Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SearchSelectBase } from '../search-select/';

@Component({
  selector: 'obs-select-company-css-table',
  templateUrl: './select-company-css-table.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCompanyCssTableComponent),
      multi: true
    }
  ],
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class SelectCompanyCssTableComponent extends SearchSelectBase {
}
