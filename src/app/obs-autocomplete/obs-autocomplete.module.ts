import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { AutocompleteComponent } from './obs-autocomplete.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AutocompleteComponent
  ],
  exports: [
    AutocompleteComponent
  ]
})
export class ObsAutocompleteModule { }
