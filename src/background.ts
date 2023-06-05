/**
 * Background script
 *
 * The background script runs as long as the extension is active, regardless of
 * whether the app (the app window) is open or not.
 *
 * See https://developer.chrome.com/extensions/background_pages
 */
import { DatePipe } from '@angular/common'
import { HttpBackend, HttpEvent, HttpRequest } from '@angular/common/http'
import { Injector, NgZone } from '@angular/core'
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
import 'zone.js'

import {
  AnalyticsIdConfig,
  AnalyticsService,
} from './app/analytics/analytics.service'
import { BadgeService } from './app/background/badge.service'
import { TabService } from './app/background/tab.service'
import { ChromeAlarmApiService } from './app/chrome/chrome-alarm-api.service'
import { ChromeApiService } from './app/chrome/chrome-api.service'
import { ChromeNotificationService } from './app/chrome/chrome-notification'
import { DeduplicationService } from './app/duplicates/service/deduplication.service'
import { SettingsService } from './app/settings/service/settings.service'
import { SnoozeService } from './app/snooze/service/snooze.service'
import { DatabaseService } from './app/storage/service/database.service'
import { LocalStorageService } from './app/storage/service/local-storage.service'
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
  new NGXLoggerServerService(httpBackend, new NgZone({})),
)

const analyticsConfiguration: AnalyticsIdConfig = {
  id: GOOGLE_ANALYTICS_TRACKING_ID,
}

class Background {
  injector: Injector

  /**
   * Initialize background script
   */
  constructor() {
    const options = {
      providers: [
        { provide: NGXLogger, useValue: logger },
        { provide: LocalStorageService, deps: [] },
        { provide: ChromeApiService, deps: [] },
        { provide: ChromeNotificationService, deps: [] },
        { provide: ChromeAlarmApiService, deps: [] },

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
          deps: [
            ChromeApiService,
            ChromeNotificationService,
            DatabaseService,
            SettingsService,
          ],
        },

        {
          provide: SnoozeService,
          deps: [
            ChromeAlarmApiService,
            ChromeApiService,
            DatabaseService,
            NGXLogger,
            SettingsService,
          ],
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
          ],
        },
      ],
    }

    this.injector = Injector.create(options)
  }

  public start() {
    const tabService = this.injector.get(TabService)
    const snoozeService = this.injector.get(SnoozeService)
    snoozeService.setUpContextMenus.bind(snoozeService)()
  }
}

// Init background script
// tslint:disable-next-line:no-unused-expression
new Background().start()
