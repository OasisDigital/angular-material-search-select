import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { shortOptions } from '../short-options';

@Component({
  selector: 'obs-demo-0-material-sample',
  templateUrl: './demo-0-material-sample.component.html'
})
export class Demo0MaterialSampleComponent {

  builtIn = new FormControl();
  reqExample = new FormControl(null, [Validators.required]);
  options = shortOptions;

  displayWith1 = this.displayWith.bind(this);

  displayWith(value: any) {
    const result = this.options.find(x => x.value === value);
    return result && result.display;
  }
}
