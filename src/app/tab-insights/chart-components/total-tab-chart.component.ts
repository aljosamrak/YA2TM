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

    const [labels, values] = this.window(
      records,
      0,
      (value, record) => record.tabs,
    )

    this.setChartData(labels, values)
  }

  constructor() {
    super()
    this.setTitle('Total number of tabs')
  }
}
