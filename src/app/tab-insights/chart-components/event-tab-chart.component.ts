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
    const windowTime =
      (records[records.length - 1].timestamp - records[0].timestamp) / 100
    const labels: Date[] = []
    const values: number[] = []
    let nextWindowTime = records[0].timestamp + windowTime
    let aggregation = 0
    records.forEach((record) => {
      if (record.timestamp > nextWindowTime) {
        labels.push(new Date(nextWindowTime))
        values.push(aggregation)
        nextWindowTime += windowTime
        aggregation = 0
      }

      if (record.event === this.desiredEvent) {
        aggregation += 1
      }
    })

    this.setChartData(labels, values)
  }
}
