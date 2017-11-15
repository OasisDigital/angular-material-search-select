import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { shortOptions } from '../short-options';

@Component({
  selector: 'obs-demo-0-material-sample',
  templateUrl: './demo-0-material-sample.component.html',
  styleUrls: []
})
export class Demo0MaterialSampleComponent {

  builtIn: FormControl = new FormControl();
  options = shortOptions;

  displayWith(value: any) {
    const result = this.options.find(x => x.value === value);
    return result && result.display;
  }

}
