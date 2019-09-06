<h1 align="center" style="border-bottom: none;">fusing-angular</h1>
<h3 align="center">Provides an extremely fast seed project for the development of Angular Universal (SSR) and Electron projects.</h3>

## Goals
Designed to get a team up and running with a fast development toolkit for Angular Universal, Electron, and NativeScript applications.

### Angular Features
- [x] Angular 9 w/ Ivy Renderer
- [x] Platform specific Angular modules.
- [x] Multi Language support.
- [ ] Angular PWA support.

### Development Features
- [x] A blazing fast bundler [FuseBox](http://fuse-box.org).
- [x] Production ready builds.
- [x] Angular specific TSLint rules.
- [ ] Hot Module Reloading (HMR) for faster browser reloads during client development.
- [ ] [Heroku](https://www.heroku.com), Docker, and Serverless (GC, AWS) Deployment Examples.

### Testing Features
- [x] A blazing fast test runner [Jest](https://facebook.github.io/jest).
- [x] Angular testing via `jest`
- [x] Server (api/rendering) testing via `supertest` and `jest`
- [ ] E2E testing via `cypress`
- [ ] Electron testing via `spectron`

### Performance Features
- [x] [Brotli compression](https://github.com/google/brotli) with [gzip](http://www.gzip.org) fallback.
- [x] [Ahead-of-Time](https://angular.io/guide/aot-compiler) (AOT) compilation support.
- [ ] [Lazy Loaded](https://angular-2-training-book.rangle.io/handout/modules/lazy-loading-module.html) modules.

### Universal (SSR) Features
- [x] Flicker-free Angular Universal server built on Express.
- [x] Server prepped to support clustered mode for horizontal scaling via [throng](https://github.com/hunterloftis/throng).
- [x] [HTTP Cache-Tag](https://github.com/flocasts/flo-angular/tree/master/projects/flosportsinc/ng-http-cache-tags) support.
- [x] Unified logging.

### Electron Features
- [x] main process compiled to bytecode via [bytenode](https://github.com/OsamaAbbas/bytenode) to protect your source code.
- [ ] Configured to ouput windows, mac, and linux builds.

### Caveats
- No CSS preprocessor. Just use plain CSS w/ css-variables.

## Commands
| Command  | Info |
| ------------- | ------------- |
| test  | Runs all `.spec.ts` files through [Jest](https://facebook.github.io/jest)  |
| test.cov  | Runs all `.spec.ts` files through [Jest](https://facebook.github.io/jest) w/ coverage reporting.  |
| test.watch  | Continous testing of all `.spec.ts` files through [Jest](https://facebook.github.io/jest)  |
| build | generate web application artifacts |
| build.prod | generate web application artifacts w/ production optimizations |
| build.desktop | generate web & desktop application artifacts |
| build.desktop.prod | generate web & desktop application artifacts w/ production optimizations |
| start | Starts the Angular Universal server for development and watches for changes. |
| start.prod  | Starts the Angular Universal server w/ optimizations. |
| start.desktop | Starts the desktop application for development and watches for changes.  |
| start.desktop.prod  | Starts the desktop application w/ optimizations.  |
| lint | Checks app an tools for lint failures |
| lint.app | Checks /src for lint failures |
| lint.tools | Checks /tools for lint failures |
| release.mac | Production electron output for mac |
| release.win | Production electron output for windows |
| release.linux | Production electron output for linux |
| release.all | Production electron output for all three platforms |

## Application Configuration
TODO

## Conventions
TODO

## Environment Variables
TODO
