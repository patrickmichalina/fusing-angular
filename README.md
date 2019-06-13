<h1 align="center" style="border-bottom: none;">fusing-angular</h1>
<h3 align="center">Provides an extremely fast seed project for the development of Angular Universal (SSR) projects.</h3>
<!-- <p align="center">
  <a href="https://greenkeeper.io">
    <img alt="greenkeeper" src="https://badges.greenkeeper.io/semantic-release/semantic-release.svg">
  </a>
  <a href="https://david-dm.org/patrickmichalina/onvif-probe-rx">
    <img alt="greenkeeper" src="https://david-dm.org/patrickmichalina/onvif-probe-rx/status.svg">
  </a>
  <a href="https://david-dm.org/patrickmichalina/onvif-probe-rx?type=dev">
    <img alt="greenkeeper" src="https://david-dm.org/patrickmichalina/onvif-probe-rx/dev-status.svg">
  </a>
</p> -->

## Goals
Designed to get a team up and running with a fast development toolkit for Angular Univerasl, Electron, and NativeScript applications.

## Features
- [x] [Angular](https://github.com/angular/angular/blob/master/CHANGELOG.md) as the application framework.
- [x] [FuseBox](http://fuse-box.org) as the TypeScript/JavaScript bundler.
- [x] [Sparky](http://fuse-box.org/page/sparky) as the task runner.
- [x] [Jest](https://facebook.github.io/jest) for unit and component testing.
- [x] Production ready builds.
- [x] Flicker free Angular Universal server built on Express.
- [x] [Brotli compression](https://github.com/google/brotli) with [gzip](http://www.gzip.org) fallback.
- [x] Hot Module Reloading (HMR) for faster browser reloads during client development.
- [x] [Ahead-of-Time](https://angular.io/guide/aot-compiler) (AOT) compilation support.
- [x] Server prepped to support clustered mode for horizontal scaling via [throng](https://github.com/hunterloftis/throng).
- [x] Angular specific TSLint rules.
- [x] Multi Language support.
- [ ] Angular PWA support.
- [ ] Seamless server/client integration for of cookies, logging, and authentication.
- [x] [HTTP Cache-Tag](https://github.com/flocasts/flo-angular/tree/master/projects/flosportsinc/ng-http-cache-tags) support.
- [ ] HTTP 301 Redirection support.
- [ ] [Lazy Loaded](https://angular-2-training-book.rangle.io/handout/modules/lazy-loading-module.html) modules.
- [ ] [Heroku](https://www.heroku.com), Docker, and Serverless (GC, AWS) Deployment Examples.
- [x] Electron app compiled to V8 bytecode via [bytenode](https://github.com/OsamaAbbas/bytenode) so that you can protect your source code.

## Commands
| Command  | Info |
| ------------- | ------------- |
| test  | Runs all .spec.ts files through [Jest](https://facebook.github.io/jest)  |
| test.watch  | Continous testing of all .spec.ts files through [Jest](https://facebook.github.io/jest)  |
| start  | Starts the Angular Universal server for development with HMR enabled.  |
| start.deving | Starts the Angular Universal server for development with HMR enabled and runs unit tests continuously. |
| start.spa  | Similiar to the Angular CLI experience - no server side rendering support.  |
| start.desktop  | Electorn app watches for changes and rebuild accordinlgy.  |
| start.prod  | Starts the Angular Universal server as if on a production environment.  |
| start.prod.desktop  | Starts Universal and electron with production level optimizations.  |
| build.prod  | Build server/browser production files  |
| build.prod.desktop  | Build server/browser/electron production files  |
| lint  | Checks your codebase for lint failures |

## Application Configuration

## Conventions
TODO

## Environment Variables
TODO


<!-- - [x] Full favicon icon generation for multiple devices derived from a single seed image -->
<!-- - [x] [angular-tslint-rules](https://github.com/fulls1z3/angular-tslint-rules) as configuration preset for [TSLint](https://github.com/palantir/tslint) and [codelyzer](https://github.com/mgechev/codelyzer). -->
<!-- - [x] Automatic static file cache invalidation -->
<!-- - [x] Vendor-agnostic analytics using [angulartics2](https://github.com/angulartics/angulartics2) -->
