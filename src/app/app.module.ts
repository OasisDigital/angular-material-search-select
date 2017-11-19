import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { Routes, RouterModule } from '@angular/router';

import { ObsAutocompleteModule } from './obs-autocomplete/';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { Demo0MaterialSampleComponent } from './demo-0-material-sample/demo-0-material-sample.component';
import { Demo1SimpleFastComponent } from './demo-1-simple-fast/demo-1-simple-fast.component';
import { Demo2LongSlowComponent } from './demo-2-long-slow/demo-2-long-slow.component';
import { Demo3RealApiComponent } from './demo-3-real-api/demo-3-real-api.component';
import { Demo4CascadeComponent } from './demo-4-cascade/demo-4-cascade.component';
import { Demo5MultiColumnComponent } from './demo-5-multi-column/demo-5-multi-column.component';
import { AngularODataModule } from './angular-odata-fork';
import { SelectCompanyComponent } from './select-company/select-company.component';

const routes: Routes = [
  { path: '', redirectTo: 'simple', pathMatch: 'full' },
  { path: 'sample', component: Demo0MaterialSampleComponent },
  { path: 'simple', component: Demo1SimpleFastComponent },
  { path: 'long', component: Demo2LongSlowComponent },
  { path: 'real', component: Demo3RealApiComponent },
  { path: 'cascade', component: Demo4CascadeComponent },
  { path: 'multi', component: Demo5MultiColumnComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    Demo0MaterialSampleComponent,
    Demo1SimpleFastComponent,
    Demo2LongSlowComponent,
    Demo3RealApiComponent,
    Demo4CascadeComponent,
    Demo5MultiColumnComponent,
    SelectCompanyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    ObsAutocompleteModule,
    HttpClientModule,
    AngularODataModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
