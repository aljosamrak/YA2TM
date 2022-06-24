import { Component, Input, OnInit } from '@angular/core'
import 'chartjs-adapter-moment'
import 'chartjs-plugin-zoom'
import 'hammerjs'

import { EventRecord, TrackedEvent } from '../../storage/model/EventRecord'
import { BaseTabChartComponent } from './base-tab-chart.component'

@Component({
  selector: 'event-tab-chart-component',
  templateUrl: 'line-chart.component.html',
})
export class EventTabChartComponent
  extends BaseTabChartComponent
  implements OnInit
{
  @Input() desiredEvent: TrackedEvent = TrackedEvent.TabOpened
  @Input() title = ''

  ngOnInit(): void {
    this.setTitle(this.title)
  }

  @Input()
  override set data(records: EventRecord[]) {
    if (records.length <= 0) {
      return
    }

    const [labels, values] = this.window(records, 0, (value, record) => {
      return value + (record.event === this.desiredEvent ? 1 : 0)
    })

    this.setChartData(labels, values)
  }
}
