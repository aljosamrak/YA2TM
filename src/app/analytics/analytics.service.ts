import { Injectable, Optional } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { measure } from 'measurement-protocol'
import { v4 as uuidv4 } from 'uuid'
import { UUID_KEY } from '../storage/model/Key'
import { LocalstorageService } from '../storage/service/localstorage.service'

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
  tracker: any

  constructor(
    private config: AnalyticsIdConfig,
    private localstorageService: LocalstorageService,
    @Optional() router: Router,
  ) {
    const myuuid = uuidv4()

    try {
      localstorageService.get(UUID_KEY).then((uuid) => {
        if (!uuid) {
          uuid = myuuid
          this.localstorageService.set(UUID_KEY, uuid)
        }

        this.tracker = measure(config.id, { cid: uuid })

        router?.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            if (this.tracker) {
              this.tracker.pageview(event.url).send()
            }
          }
        })
      })
    } catch (ex) {
      console.error('Error appending google analytics')
      console.error(ex)
    }
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
    try {
      this.localstorageService.set(UUID_KEY, uuid)
      this.tracker = measure(this.tracker.id, { cid: uuid })
    } catch (ex) {
      console.error('Error appending google analytics')
      console.error(ex)
    }
  }
}
