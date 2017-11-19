import { Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ObsAutocompleteBase } from '../obs-autocomplete/';

@Component({
  selector: 'obs-select-company',
  templateUrl: './select-company.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCompanyComponent),
      multi: true
    }
  ],
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class SelectCompanyComponent extends ObsAutocompleteBase {
}
