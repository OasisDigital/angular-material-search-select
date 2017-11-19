import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

@NgModule({
  declarations: [ ],
  imports: [ CommonModule ],
  exports: [ ]
})
export class AngularODataModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: AngularODataModule
    };
  }

}
