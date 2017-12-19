# angular-material-obs-autocomplete

This component wraps the Angular Material mat-autocomplete with a solution that
receives lookup data via a passed in via an observable function. That function
could retrieve data locally or remotely.

## Try it

Demo running at:

https://oasisdigital.github.io/angular-material-obs-autocomplete/

NPM package:

https://www.npmjs.com/package/angular-material-obs-autocomplete

## How it works, and why

To behave correctly, this component must accommodate the asynchronous nature of
the lookup data. This turns out to be rather complex.

We have found this problem comes up regularly on our projects, and have finally
created a generic solution, reusable. It is not ultimately reusable though,
because it is bound to Angular Material, which we use on many projects.

This repository/project contains both the component itself, and screens that
demonstrate its use.

## To use it

You need to provide two functions.

One function provides a way to search for values and provide the display data.

The other function provides a way to execute user searches and provide a list of
candidates.

## To publish new versions

Work on it:

```
yarn start
```

Prepare a build:

```
yarn run build
```

Publish:

```
npm publish dist
```

## Also an example of how to publish a component

In addition to being a useful component, we have been using this repository
together up example bits for how to most effectively publish a Angular component
to NPM. You can see these patterns in use here, and borrow them for other
components.

* use ng-packagr, Outsource much of the complexity in bundling to that brilliant
  package
* start with a Angular CLI project
* add 1..n modules inside, for the components to be packaged
* Make the overall application provide a demo, test environment, and so on for
  the components
