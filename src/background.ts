import { DatePipe } from '@angular/common'
import { HttpBackend, HttpEvent, HttpRequest } from '@angular/common/http'
import { Injector } from '@angular/core'
import {
  NGXLogger,
  NGXLoggerConfigEngineFactory,
  NGXLoggerMapperService,
  NGXLoggerMetadataService,
  NGXLoggerRulesService,
  NGXLoggerServerService,
  NGXLoggerWriterService,
} from 'ngx-logger'
import { Observable } from 'rxjs'

import {
  AnalyticsIdConfig,
  AnalyticsService,
} from './app/analytics/analytics.service'
import { DeduplicationService } from './app/background/deduplication.service'
import { BadgeService } from './app/badge.service'
import { ChromeApiService } from './app/chrome-api.service'
import { SettingsService } from './app/settings/service/settings.service'
import { DatabaseService } from './app/storage/service/database.service'
import { LocalStorageService } from './app/storage/service/local-storage.service'
import { TabService } from './app/tab.service'
import { GOOGLE_ANALYTICS_TRACKING_ID } from './environments/environment-generated'

const httpBackend = new (class MyRunnable extends HttpBackend {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return new Observable((subscriber) => {
      subscriber.complete()
    })
  }
})()

const logger = new NGXLogger(
  { level: 0, serverLogLevel: 0, disableConsoleLogging: false },
  new NGXLoggerConfigEngineFactory(),
  new NGXLoggerMetadataService(new DatePipe('', undefined)),
  new NGXLoggerRulesService(),
  new NGXLoggerMapperService(httpBackend),
  new NGXLoggerWriterService(''),
  new NGXLoggerServerService(httpBackend),
)

const analyticsConfiguration: AnalyticsIdConfig = {
  id: GOOGLE_ANALYTICS_TRACKING_ID,
}

const options = {
  providers: [
    { provide: NGXLogger, useValue: logger },
    { provide: LocalStorageService, deps: [] },
    { provide: ChromeApiService, deps: [] },

    { provide: AnalyticsIdConfig, useValue: analyticsConfiguration },

    {
      provide: AnalyticsService,
      deps: [AnalyticsIdConfig, LocalStorageService],
    },

    { provide: DatabaseService, deps: [NGXLogger, AnalyticsService] },

    { provide: SettingsService, deps: [LocalStorageService] },

    { provide: BadgeService, deps: [ChromeApiService, SettingsService] },

    {
      provide: DeduplicationService,
      deps: [ChromeApiService, DatabaseService, SettingsService],
    },

    {
      provide: TabService,
      deps: [
        NGXLogger,
        AnalyticsService,
        BadgeService,
        ChromeApiService,
        DatabaseService,
        DeduplicationService,
        SettingsService,
      ],
    },
  ],
}

const injector = Injector.create(options)
const tabService = injector.get(TabService)
