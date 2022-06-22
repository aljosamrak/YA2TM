import { Component, Input } from '@angular/core'
import 'chartjs-adapter-moment'
import 'chartjs-plugin-zoom'
import 'hammerjs'

import { EventRecord } from '../../storage/model/EventRecord'
import { BaseTabChartComponent } from './base-tab-chart.component'

@Component({
  selector: 'total-tab-chart-component',
  templateUrl: 'line-chart.component.html',
})
export class TotalTabChartComponent extends BaseTabChartComponent {
  @Input()
  override set data(records: EventRecord[]) {
    if (records.length <= 0) {
      return
    }

    const windowTime =
      (records[records.length - 1].timestamp - records[0].timestamp) / 20
    const labels: Date[] = []
    const values: number[] = []
    let nextWindowTime = records[0].timestamp + windowTime
    records.forEach((record) => {
      if (record.timestamp > nextWindowTime) {
        labels.push(new Date(nextWindowTime))
        values.push(record.tabs)
        nextWindowTime += windowTime
      }
    })

    this.setChartData(labels, values)
  }

  constructor() {
    super()
    this.setTitle('Total number of tabs')
  }
}
