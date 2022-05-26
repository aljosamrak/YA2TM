import { Component, OnInit } from '@angular/core'
import { EventRecord, TrackedEvent } from '../../storage/model/EventRecord'
import { DatabaseService } from '../../storage/service/database.service'

const DAYS_7 = 17 * 24 * 3600 * 1000

export type DateRange = {
  min: number
  max: number
}

@Component({
  selector: 'tab-insights',
  templateUrl: './tab-insights-component.component.html',
  styleUrls: ['./tab-insights-component.component.sass'],
})
export class TabInsightsComponent implements OnInit {
  public trackedEvent = TrackedEvent
  data: EventRecord[] = []
  dateRange: DateRange

  constructor(private databaseService: DatabaseService) {
    const timeNow = Date.now()
    this.dateRange = {
      min: timeNow - DAYS_7,
      max: timeNow,
    }
  }

  // TODO reset zoom button
  ngOnInit(): void {
    const timeNow = Date.now()
    this.databaseService.query(timeNow - DAYS_7, timeNow).then((_data) => {
      if (_data.length > 0) {
        this.data = _data
      }
    })

    // let tabs = 100
    // for (let i = timeNow - 1 * 3600 * 1000; i < timeNow; i += 1000) {
    //   let a = Math.random()
    //   tabs += a < 0.5 ? -1 : +1
    //   this.database.insert_records({
    //     timestamp: i,
    //     event: a < 0.5 ? TrackedEvent.TabClosed : TrackedEvent.TabOpened,
    //     url: 'url',
    //     windows: 5,
    //     tabs: tabs,
    //   })
    // }
  }

  setDataRange(dateRange: DateRange) {
    this.dateRange = dateRange

    this.databaseService.query(dateRange.min, dateRange.max).then((_data) => {
      if (_data.length > 0) {
        this.data = _data
      }
    })
  }
}
