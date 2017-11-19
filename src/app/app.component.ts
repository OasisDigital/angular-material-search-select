import { Component } from '@angular/core';

@Component({
  selector: 'obs-root',
  templateUrl: './app.component.html',
  styles: [`
  .nav ul {
    list-style: none;
    text-align: center;
    margin: 0;
  }
  .nav li {
    display: inline-block;
  }
  .nav a {
    text-decoration: none;
    display: block;
    transition: .3s background-color;
  }
  .green-background {
    background-color: #aeffae;
  }
   `],
  // tslint:disable-next-line:use-host-property-decorator
  host: { 'class': 'mat-typography' }
})
export class AppComponent {

}
