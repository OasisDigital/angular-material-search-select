import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTooltipModule
} from '@angular/material';

import { SearchSelectComponent } from './search-select.component';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    SearchSelectComponent
  ],
  exports: [
    SearchSelectComponent
  ]
})
export class SearchSelectModule { }
