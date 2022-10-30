import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NavbarService } from 'angular-bootstrap-md'
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger'
import { GOOGLE_ANALYTICS_TRACKING_ID } from '../environments/environment-generated'
import { AnalyticsModule } from './analytics/analytics.module'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { PageNotFoundComponentComponent } from './page-not-found-component/page-not-found-component.component'

@NgModule({
  declarations: [AppComponent, PageNotFoundComponentComponent],
  imports: [
    AnalyticsModule.forRoot({
      id: GOOGLE_ANALYTICS_TRACKING_ID,
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    // HttpClientModule is only needed if you want to log on server or if you want to inspect sourcemaps
    HttpClientModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
    }),
  ],
  providers: [NavbarService],
  bootstrap: [AppComponent],
})
export class AppModule {}
