import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { SearchSelectBase } from './base';

// The CSS approach below is the documented solution:
// https://github.com/angular/material2/issues/3810
// https://github.com/angular/material2/pull/7176

// To set the width, style the first class something like this:
// width: 400px;
// max-width: 400px !important;
// ... need to figure out how to set the number programmaticlly.

@Component({
  selector: 'search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchSelectComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchSelectComponent extends SearchSelectBase {
  @Input() placeholder: string;
  @Input() debounceTime = 100;
  @Input() width = '';
  @Input() emptyText = '';
}
