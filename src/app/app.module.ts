import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatMenuModule,
  MatTableModule,
  MatButtonModule
} from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { SearchSelectModule } from './search-select/';
import { AppComponent } from './app.component';
import { Demo0MaterialSampleComponent } from './demo-0-material-sample/demo-0-material-sample.component';
import { Demo1SimpleFastComponent } from './demo-1-simple-fast/demo-1-simple-fast.component';
import { Demo2LongSlowComponent } from './demo-2-long-slow/demo-2-long-slow.component';
import { Demo3RealApiComponent } from './demo-3-real-api/demo-3-real-api.component';
import { Demo4CascadeComponent } from './demo-4-cascade/demo-4-cascade.component';
import { Demo5MultiColumnComponent } from './demo-5-multi-column/demo-5-multi-column.component';
import { SelectCompanyCssTableComponent } from './select-company-css-table/select-company-css-table.component';
import { SelectCompanyMatGridComponent } from './select-company-mat-table/select-company-mat-table.component';
import { ExplanationComponent } from './explanation/explanation.component';

const routes: Routes = [
  { path: '', component: ExplanationComponent, pathMatch: 'full' },
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
    SelectCompanyCssTableComponent,
    SelectCompanyMatGridComponent,
    ExplanationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatMenuModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchSelectModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
