import { Component, Inject, OnInit } from '@angular/core'
import { Database, Record } from '../../../model/Database'
import { TrackedEvent } from '../../../model/TrackedEvent'

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
  public TrackedEvent = TrackedEvent
  data: Record[] = []
  dateRange: DateRange

  constructor(@Inject('Database') private database: Database) {
    const timeNow = Date.now()
    this.dateRange = {
      min: timeNow - DAYS_7,
      max: timeNow,
    }
  }

  //TODO reset zoom button
  ngOnInit(): void {
    const timeNow = Date.now()
    this.database.query(timeNow - DAYS_7, timeNow).then((_data) => {
      console.log(_data)
      this.data = _data
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

    this.database.query(dateRange.min, dateRange.max).then((_data) => {
      if (_data.length === 0) {
        return
      }

      console.log(_data)
      this.data = _data
    })
  }
}
