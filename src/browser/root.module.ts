import { NgModule } from '@angular/core'
import { RootComponent } from './root.component'
import { RootRoutingModule } from './root-routing.module'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { SharedSiteModule } from './site/shared/shared.module'
import { ServiceWorkerModule } from '@angular/service-worker'
import { BrowserModule } from '@angular/platform-browser'
import { TranslateHttpLoader } from './shared/fusing/fusing.module';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './shared/fusing/environment.service';

@NgModule({
  declarations: [RootComponent],
  imports: [
    RootRoutingModule,
    
    // TranslateModule.forRoot(),
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useClass: TranslateHttpLoader,
    //     deps: [HttpClient, EnvironmentService]
    //   }
    // }),
    SharedSiteModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: process.env.pwa === "true" }),
    BrowserModule.withServerTransition({ appId: 'pm-root' })
  ],
  exports: [
    RootRoutingModule,
    TranslateModule,
    SharedSiteModule,
    ServiceWorkerModule,
    BrowserModule
  ]
})
export class RootModule { }