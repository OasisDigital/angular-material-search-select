# angular-material-obs-autocomplete

This component wraps the Angular Material mat-autocomplete with a solution that
receives lookup data via a passed in observable function. That function could
retrieve data locally or remotely.

To behave correctly, this component must therefore accommodate the asynchronous
nature of the lookup data. This turns out to be rather complex.

We have found this problem comes up regularly on our projects, and have finally
created a generic solution, reusable. It is not ultimately reusable though,
because it is bound to Angular Material, which we use on many projects.

This repository/project contains both the component itself, and screens that
demonstrate its use.

Published at:

https://www.npmjs.com/package/angular-material-obs-autocomplete

Coming soon:

* Plunkr
* Example app demo online
