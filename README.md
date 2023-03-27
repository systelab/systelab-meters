[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f34f559cc4ef4afe84448d15fb674f30)](https://www.codacy.com/gh/systelab/systelab-meters/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=systelab/systelab-charts&amp;utm_campaign=Badge_Grade)
[![Build Status](https://travis-ci.com/systelab/systelab-meters.svg?branch=master)](https://travis-ci.com/systelab/systelab-meters)
[![npm version](https://badge.fury.io/js/systelab-meters.svg)](https://badge.fury.io/js/systelab-meters)
[![Known Vulnerabilities](https://snyk.io/test/github/systelab/systelab-charts/badge.svg?targetFile=package.json)](https://snyk.io/test/github/systelab/systelab-meters?targetFile=package.json)

# systelab-meters

Library with meter widgets components to speed up your Angular developments.

## Working with the repo

In order to clone the repository and test the library use the following commands:

```bash
git clone https://github.com/systelab/systelab-meters.git
cd systelab-meters
npm run build-lib
ng serve
```

This will bootstrap a showcase application to test the different widgets.

In order to publish the library, an authorized npm user is required. Once set, update the version in the package.json, and run the npm publish script:

```npm
npm run build-lib
cd dist/systelab-meters
npm publish
```

## Documentation

Read the [provided documentation](https://github.com/systelab/systelab-meters/blob/master/projects/systelab-meters/README.md) to use the library

# Breaking changes

## Version 15.x.x - Angular 15

[Angular 15 news](https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8)

- Router and HttpClient tree-shakable standalone APIs
- Directive composition API
- Image directive is now stable
- Functional router guards
- Router unwraps default imports
- Better stack traces
- Release MDC-based components to stable
- Improvements in the experimental esbuild support

## Version 14.x.x - Angular 14

[Angular 13 news](https://blog.angular.io/angular-v13-is-now-available-cce66f7bc296)

-   **View Engine** is no longer available
-   Libraries built with the latest version of the **APF** [Angular Package Format](https://angular.io/guide/angular-package-format) will no longer require the use of ngcc. As a result of these changes library developers can expect leaner package output and faster execution.
-   The new API removes the need for ComponentFactoryResolver being injected into the constructor. Ivy creates the opportunity to instantiate the component with ViewContainerRef.createComponent without creating an associated factory
-   **End of IE11 support**
-   Angular now supports the use of persistent build cache by default for new v13 projects [More info](https://github.com/angular/angular-cli/issues/21545) and [CLI Cache](https://angular.io/cli/cache)
-   **RxJS 7.4** is now the default for apps created with ng new
-   Dynamically enable/disable validators: allows built-in validators to be disabled by setting the value to null
-   Important improvements to TestBed that now does a better job of tearing down test modules and environments after each test
-   *canceledNavigationResolution* router flag to restore the computed value of the browser history when set to *computed*
-   [TypeScript 4.4](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html)

[Angular 14 news](https://blog.angular.io/angular-v14-is-now-available-391a6db736af)

-   [Standalone Components](https://angular.io/guide/standalone-components)
-   [Typed Angular Forms](https://angular.io/guide/typed-forms)
-   Streamlined page title accessibility
-   Extended developer diagnostics
-   Catch the invalid “Banana in a box” error on your two-way data bindings
-   Catch nullish coalescing on non-nullable values in Angular templates
-   Bind to protected component members directly from the templates
-   Optional injectors in Embedded Views
-   Support for passing in an optional injector when creating an embedded view through *ViewContainerRef.createEmbeddedView* and *TemplateRef.createEmbeddedView*
-   NgModel changes are reflected in the UI for OnPush components
-   [TypeScript 4.6](https://devblogs.microsoft.com/typescript/announcing-typescript-4-6/)

## Version 9 - Angular 12

Added chartjs dependencies from peerDependencies to dependencies, now no need to add it in app package that uses the library.

IE11 support has been deprecated due to the upgrade to Angular 12

Use of [Ivy](https://angular.io/guide/ivy), applications that uses this library have to use Angular 12 and Ivy rendering.

Added --noImplicitOverride flag to allow override methods and get error for unintentionally overrides 
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#override-and-the---noimplicitoverride-flag

## Version 6
Few changes where introduce in version 6 in order to standardize the library and support Angular 9.
The following steps should be considered when migrating from version 5.

1. When importing the module do not use .forRoot(); In WebStorm, replace in path:
```
- SystelabMetersModule.forRoot\(\)
- SystelabMetersModule
```
2. When importing services and modules import them from systelab-meters root. In WebStorm, replace in path:
```
- from 'systelab-meters/lib.+
- from 'systelab-meters';
```
