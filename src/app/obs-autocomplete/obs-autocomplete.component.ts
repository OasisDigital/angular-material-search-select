import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { ObsAutocompleteBase } from './base';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

// The CSS approach below is the documented "solution":
// https://github.com/angular/material2/issues/3810
// https://github.com/angular/material2/pull/7176

// To set the width, style the first class something like this:
// width: 400px;
// max-width: 400px !important;
// ... need to figure out how to set the number programmaticlly.

@Component({
  selector: 'obs-autocomplete',
  templateUrl: './obs-autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ],
  styles: [`
  .bigger-mat-ac.mat-autocomplete-panel {
     max-height: 500px !important;
  }
  .obs-mat-container {
    position: relative;
  }
  .obs-mat-container mat-spinner.obs-mat-spinner {
    position: absolute;
    right: 5px;
  }
  .obs-no-matches {
    position: absolute;
    color: silver;
    right: 5px;
  }
  .ng-invalid.ng-touched > .obs-mat-container {
    color: #f44336 !important;
  }
  .ng-invalid.ng-touched > .obs-mat-container label {
    color: #f44336 !important;
  }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent extends ObsAutocompleteBase {
  @Input() placeholder: string;
  @Input() debounceTime = 100;
  @Input() width = '';
  @Input() emptyText = '';
}
