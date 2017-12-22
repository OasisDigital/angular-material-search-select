# angular-material-obs-autocomplete

This library provides a means to use the Angular Material mat-autocomplete
component, in cases where the options to be populated must arrive asynchronously
(for example, because they come from a server). The resulting behavior is more
like a server-side "search select", in that it is intended to allow entry of
only developer approved values.

## Try it

Demo running at:

https://oasisdigital.github.io/angular-material-obs-autocomplete/

NPM package:

https://www.npmjs.com/package/angular-material-obs-autocomplete

## To use this in a project

There are two ways to consume the code here. You can see examples of them in the
various tabs of the demo. 

1. Use the provided obs-autocomplete component, as shown in "simple", "Long
   slow", "real API".
2. Write a custom component using only the base class provided in this package;
   your component will provide all the visuals, but typically doesn't need to
   provide any code at all. For an example of this, look in the source code,
   directory `demo-5-multicolumn` and the corresponding multicolumn demo tab.

For better or worse, various aspects of HTML, CSS, Angular, and other tools
conspire to frequently require option 2. This is the only way to provide full
flexibility in the appearance of the component, to match your application's
needs.

Regardless of which layout approach you choose, at run time you must provide two
functions to the component:

* Function which searches for a values, and provides corresponding display text.
* Function which takes a search query fragment and provides a list of match
  candidates.

Study the example code in the various `demo-N-*` for more about these functions.

## How it works, and why

To behave correctly, this component must accommodate the asynchronous nature of
the lookup data. This turns out to be rather complex.

We have found this problem comes up regularly on our projects, and have finally
created a generic solution, reusable. It is not ultimately reusable though,
because it is bound to Angular Material, which we use on many projects.

This repository/project contains both the component itself, and screens that
demonstrate its use.

## Also an example of how to publish a component

In addition to being a useful component, we have been using this repository
together up example bits for how to most effectively publish a Angular component
to NPM. You can see these patterns in use here, and borrow them for other
components.

* Use ng-packagr. Outsource much of the complexity in bundling to that brilliant
  package.
* Start with a Angular CLI project.
* Add a module inside, for the components to be packaged.
* Make the overall application provide a demo, test environment, etc. for
  the components.
