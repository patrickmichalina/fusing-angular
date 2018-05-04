(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.target = "server";
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("server/server.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var server_app_1 = require("./server.app");
var config_1 = require("../config");
var port = config_1.PORT;
var server = http_1.createServer(server_app_1.expressApp);
server.listen(port, function () {
    console.log('Angular Universal Server listening');
});
//# sourceMappingURL=server.js.map
});
___scope___.file("server/server.app.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// import * as cookieParser from 'cookie-parser'
// import { createLogger } from '@expo/bunyan'
// import { ngExpressEngine } from '@nguniversal/express-engine'
// import { AppServerModule } from './angular/server.angular.module'
var path_1 = require("path");
var express_engine_1 = require("@nguniversal/express-engine");
var server_angular_module_1 = require("./server.angular.module");
var shrinkRay = require('shrink-rayed');
// const minifyHTML = require('express-minify-html')
// const bunyanMiddleware = require('bunyan-middleware')
// const xhr2 = require('xhr2')
// const cors = require('cors')
// tslint:disable-next-line:no-object-mutation
// xhr2.prototype._restrictedHeaders.cookie = false
// require('ts-node/register')
var expressApp = express();
exports.expressApp = expressApp;
// const staticOptions = {
//   index: false,
//   maxAge: isProd ? ms('1y') : ms('0'),
//   setHeaders: (res: express.Response, path: any) => {
//     res.setHeader(
//       'Expires',
//       isProd
//         ? new Date(Date.now() + ms('1y')).toUTCString()
//         : new Date(Date.now() + ms('0')).toUTCString()
//     )
//   }
// }
// !isEndToEndTest &&
//   app.use(
//     bunyanMiddleware({
//       logger: createLogger({
//         name: 'Fusing-Angular',
//         type: 'node-express'
//       }),
//       excludeHeaders: ['authorization', 'cookie']
//     })
//   )
var dir = path_1.resolve('./.dist');
// expressApp.engine('html', ngExpressEngine({ bootstrap: AppServerModule }))
// app.set('ignore-routes', ['/api/'])
// app.set('view engine', 'html')
// app.set('views', dir)
// app.use(cookieParser())
expressApp.use(shrinkRay());
// app.use(cors())
// app.use(
//   minifyHTML({
//     override: true,
//     exception_url: false,
//     htmlMinifier: {
//       removeComments: true,
//       collapseWhitespace: true,
//       collapseBooleanAttributes: true,
//       removeAttributeQuotes: false,
//       minifyJS: true
//     }
//   })
// )
// app.use('/css', express.static(`${dir}/css`, staticOptions))
expressApp.use('/js', express.static(dir + "/public/js"));
expressApp.engine('html', express_engine_1.ngExpressEngine({
    bootstrap: server_angular_module_1.AppServerModule // Give it a module to bootstrap
}));
expressApp.set('view engine', 'html');
expressApp.get('/**', function (req, res) {
    var doc = "<!doctype html>\n  <html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\">\n    <title>Fusing Angular Demo</title>\n    <base href=\"/\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  </head>\n  <body>\n    <app-root></app-root>\n    <script src=\"/js/vendor.js\"></script>\n    <script src=\"/js/app.js\"></script>\n  </body>\n  </html>";
    res.render('../.dist/index', {
        req: req,
        res: res,
        document: doc
    });
});
//# sourceMappingURL=server.app.js.map
});
___scope___.file("server/server.angular.module.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("zone.js/dist/zone-node");
require("zone.js/dist/long-stack-trace-zone");
var core_1 = require("@angular/core");
var platform_server_1 = require("@angular/platform-server");
var core_2 = require("@angular/core");
var app_module_1 = require("../browser/app.module");
var app_component_1 = require("../browser/app.component");
// import { AppModule } from '../app.module';
// import { AppComponent } from '../app.component';
// import { FaviconComponent } from './favicon.component';
// import { JavascriptComponent } from './javascript.component';
// import { RouteDataService } from '../route-data.service'
// import { filter } from 'rxjs/operators';
// import { NavigationEnd } from '@angular/router';
// import { take } from 'rxjs/operators';
core_2.enableProdMode();
var AppServerModule = /** @class */ (function () {
    function AppServerModule() {
    }
    AppServerModule = __decorate([
        core_1.NgModule({
            imports: [
                app_module_1.AppModule,
                // RouterModule.forRoot([
                //   { path: 'favicon.ico', component: FaviconComponent },
                //   { path: 'js/:filename', component: JavascriptComponent, data: { customResponse: true } },
                // ]),
                platform_server_1.ServerModule,
                platform_server_1.ServerTransferStateModule,
            ],
            declarations: [],
            bootstrap: [app_component_1.AppComponent],
        })
    ], AppServerModule);
    return AppServerModule;
}());
exports.AppServerModule = AppServerModule;
//# sourceMappingURL=server.angular.module.js.map
});
___scope___.file("browser/app.module.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var app_component_1 = require("./app.component");
var home_component_1 = require("./home.component");
// import {TransferHttpCacheModule} from '@nguniversal/common';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                home_component_1.TestComponent,
                home_component_1.HomeComponent,
                home_component_1.NotFoundComponent
            ],
            imports: [
                platform_browser_1.BrowserModule.withServerTransition({ appId: 'my-app' }),
                router_1.RouterModule.forRoot([
                    { path: '', component: home_component_1.HomeComponent },
                    { path: 'test', component: home_component_1.TestComponent }
                    // { path: '**', component: NotFoundComponent }
                ], { initialNavigation: true }),
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
});
___scope___.file("browser/app.component.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            template: "\n  <div class=\"root\">\n  <h1>sdf</h1>\n  <a routerLink=\"/\">Hod  </a>\n  <a routerLink=\"/test\">test</a>\n  <router-outlet></router-outlet>\n  </div>\n  \n  ",
            styles: ["\n  \n  "]
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map
});
___scope___.file("browser/home.component.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var HomeComponent = /** @class */ (function () {
    function HomeComponent() {
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.message = 'Hello';
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            template: "<h3>{{ message }}</h3>",
            // styleUrls: ['./home.component.css'],
            styles: ["\n    background-color: red;\n    display: block;\n  "]
        })
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
var TestComponent = /** @class */ (function () {
    function TestComponent() {
    }
    TestComponent.prototype.ngOnInit = function () {
        this.message = 'asdfasdfasd TEST';
    };
    TestComponent = __decorate([
        core_1.Component({
            selector: 'app-test',
            template: "<h3>{{ message }}</h3>"
        }),
        __metadata("design:paramtypes", [])
    ], TestComponent);
    return TestComponent;
}());
exports.TestComponent = TestComponent;
var NotFoundComponent = /** @class */ (function () {
    function NotFoundComponent() {
    }
    NotFoundComponent.prototype.ngOnInit = function () {
        this.message = 'NOT FOUND';
    };
    NotFoundComponent = __decorate([
        core_1.Component({
            selector: 'app-not-found',
            template: "<h3>{{ message }}</h3>"
        }),
        __metadata("design:paramtypes", [])
    ], NotFoundComponent);
    return NotFoundComponent;
}());
exports.NotFoundComponent = NotFoundComponent;
//# sourceMappingURL=home.component.js.map
});
___scope___.file("config.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = process.env.PORT && +process.env.PORT || 5000;
//# sourceMappingURL=config.js.map
});
return ___scope___.entry = "server/server.js";
});

FuseBox.import("default/server/server.js");
FuseBox.main("default/server/server.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((m||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),u=e.substring(o+1);return[a,u]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(m){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function u(e){return{server:require(e)}}function f(e,n){var o=n.path||"./",a=n.pkg||"default",f=r(e);if(f&&(o="./",a=f[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=f[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!m&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return u(e);var s=x[a];if(!s){if(m&&"electron"!==y.target)throw"Package not found "+a;return u(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,d=t(o,e),c=i(d),p=s.f[c];return!p&&c.indexOf("*")>-1&&(l=c),p||l||(c=t(d,"/","index.js"),p=s.f[c],p||"."!==d||(c=s.s&&s.s.entry||"index.js",p=s.f[c]),p||(c=d+".js",p=s.f[c]),p||(p=s.f[d+".jsx"]),p||(c=d+"/index.jsx",p=s.f[c])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:d,validPath:c}}function s(e,r,n){if(void 0===n&&(n={}),!m)return r(/\.(js|json)$/.test(e)?g.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);y.dynamic(a,o),r(y.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=_[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function d(e){return null!==e&&["function","object","array"].indexOf(typeof e)>-1&&void 0===e.default?Object.isFrozen(e)?e.default=e:Object.defineProperty(e,"default",{value:e,writable:!0,enumerable:!1}):void 0}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=f(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),u=x[t.pkgName];if(u){var p={};for(var v in u.f)a.test(v)&&(p[v]=c(t.pkgName+"/"+v));return p}}if(!i){var h="function"==typeof r,_=l("async",[e,r]);if(_===!1)return;return s(e,function(e){return h?r(e):null},r)}var w=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var b=i.locals={},j=n(t.validPath);b.exports={},b.module={exports:b.exports},b.require=function(e,r){var n=c(e,{pkg:w,path:j,v:t.versions});return y.sdep&&d(n),n},m||!g.require.main?b.require.main={filename:"./",paths:[]}:b.require.main=g.require.main;var k=[b.module.exports,b.require,b.module,t.validPath,j,w];return l("before-import",k),i.fn.apply(k[0],k),l("after-import",k),b.module.exports}if(e.FuseBox)return e.FuseBox;var p="undefined"!=typeof ServiceWorkerGlobalScope,v="undefined"!=typeof WorkerGlobalScope,m="undefined"!=typeof window&&"undefined"!=typeof window.navigator||v||p,g=m?v||p?{}:window:global;m&&(g.global=v||p?{}:window),e=m&&"undefined"==typeof __fbx__dnm__?e:module.exports;var h=m?v||p?{}:window.__fsbx__=window.__fsbx__||{}:g.$fsbx=g.$fsbx||{};m||(g.require=require);var x=h.p=h.p||{},_=h.e=h.e||{},y=function(){function r(){}return r.global=function(e,r){return void 0===r?g[e]:void(g[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){_[e]=_[e]||[],_[e].push(r)},r.exists=function(e){try{var r=f(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=f(e,{}),n=x[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var u=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);u(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=x.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(x[e])return n(x[e].s);var t=x[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=x,r.isBrowser=m,r.isServer=!m,r.plugins=[],r}();return m||(g.FuseBox=y),e.FuseBox=y}(this))