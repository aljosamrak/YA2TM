import { Injectable, Optional } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { measure } from 'measurement-protocol'
import { v4 as uuidv4 } from 'uuid'

import { environment } from '../../environments/environment'
import { UUID_KEY } from '../storage/model/Key'
import { LocalStorageService } from '../storage/service/local-storage.service'

export class AnalyticsIdConfig {
  id = ''
}

export type EventArgs = {
  category: string
  action: string
  label?: string
  value?: number
}

export type TimingArgs = {
  category: string
  name: string
  value: number
  label?: string
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  tracker?: any

  constructor(
    private config: AnalyticsIdConfig,
    private localstorageService: LocalStorageService,
    @Optional() router: Router,
  ) {
    localstorageService
      .get(UUID_KEY)
      .then((uuid) => {
        if (!uuid) {
          uuid = uuidv4()
          this.localstorageService.set(UUID_KEY, uuid)
        }

        this.tracker = createTracker(config.id, uuid)

        router?.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            if (this.tracker) {
              this.tracker.pageview(event.url).send()
            }
          }
        })
      })
      .catch((exception) => {
        console.error('Error appending google analytics')
        console.error(exception)
      })
  }

  event(eventArgs: EventArgs) {
    this.tracker.event(
      eventArgs.category,
      eventArgs.action,
      eventArgs.label,
      eventArgs.value,
    )
  }

  time(timingArgs: TimingArgs) {
    this.tracker.timing(
      timingArgs.category,
      timingArgs.name,
      timingArgs.value,
      timingArgs.label,
    )
  }

  resetUuid() {
    const uuid = uuidv4()
    this.tracker = createTracker(this.tracker.id, uuid)
    return this.localstorageService.set(UUID_KEY, uuid)
  }
}

function createTracker(trackingId: string, uuid: string) {
  try {
    return measure(trackingId, {
      cid: uuid,
      av: environment.version,
    })
  } catch (ex) {
    console.error('Error appending google analytics')
    console.error(ex)
    return undefined
  }
}
