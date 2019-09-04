<h1 align="center" style="border-bottom: none;">fusing-angular</h1>
<h3 align="center">Provides an extremely fast seed project for the development of Angular Universal (SSR) projects.</h3>

## Goals
Designed to get a team up and running with a fast development toolkit for Angular Univerasl, Electron, and NativeScript applications.

**Rewrite underway to support the latest, greatest, fastest build system.**

### Angular Features
- [x] Angular 9 w/ Ivy Renderer
- [x] Always compiled AOT, not optional at this time.
- [x] Platform specific Angular modules.
- [x] Multi Language support.
- [ ] Angular PWA support.

### Development Features
- [x] A blazing fast bundler [FuseBox](http://fuse-box.org).
- [x] Hot Module Reloading (HMR) for faster browser reloads during client development.
- [x] Production ready builds.
- [x] Angular specific TSLint rules.
- [ ] [Heroku](https://www.heroku.com), Docker, and Serverless (GC, AWS) Deployment Examples.

### Testing Features
- [x] A blazing fast test runner [Jest](https://facebook.github.io/jest).
- [ ] Angular testing via `jest`
- [ ] Server (api/rendering) testing via `supertest` and `jest`
- [ ] Electron testing via `spectron`

### Performance Features
- [x] [Brotli compression](https://github.com/google/brotli) with [gzip](http://www.gzip.org) fallback.
- [x] [Ahead-of-Time](https://angular.io/guide/aot-compiler) (AOT) compilation support.
- [ ] [Lazy Loaded](https://angular-2-training-book.rangle.io/handout/modules/lazy-loading-module.html) modules.

### Universal (SSR) Features
- [x] Flicker-free Angular Universal server built on Express.
- [x] Server prepped to support clustered mode for horizontal scaling via [throng](https://github.com/hunterloftis/throng).
- [x] [HTTP Cache-Tag](https://github.com/flocasts/flo-angular/tree/master/projects/flosportsinc/ng-http-cache-tags) support.
- [ ] Seamless server/client integration for of cookies, logging, and authentication.

### Electron Features
- [x] App compiled to V8 bytecode via [bytenode](https://github.com/OsamaAbbas/bytenode) so that you can protect your source code.
- [ ] Configured to ouput windows, mac, and linux builds.

### Caveats
- No CSS preprocessor. Just use plain CSS w/ css-variables.
- AOT is a requirement at this time.

## Commands
| Command  | Info |
| ------------- | ------------- |
<!-- | test  | Runs all `.spec.ts` files through [Jest](https://facebook.github.io/jest)  |
| test.cov  | Runs all `.spec.ts` files through [Jest](https://facebook.github.io/jest) w/ coverage reporting.  |
| test.watch  | Continous testing of all `.spec.ts` files through [Jest](https://facebook.github.io/jest)  |
| start  | Starts the Angular Universal server for development with HMR enabled.  |
| start.deving | Starts the Angular Universal server for development with HMR enabled and runs unit tests continuously. |
| start.spa  | Similiar to the Angular CLI experience - no server side rendering support.  |
| start.desktop  | Electorn app watches for changes and rebuild accordinlgy.  |
| start.prod  | Starts the Angular Universal server as if on a production environment.  |
| start.prod.desktop  | Starts Universal and electron with production level optimizations.  |
| build.prod  | Build server/browser production files  |
| build.prod.desktop  | Build server/browser/electron production files  |
| lint  | Checks your codebase for lint failures | -->

## Application Configuration

## Conventions
TODO

## Environment Variables
TODO

