import { Component, Input } from '@angular/core'
import 'chartjs-adapter-moment'
import 'chartjs-plugin-zoom'
import 'hammerjs'

import { EventRecord } from '../../storage/model/EventRecord'
import { BaseTabChartComponent } from './base-tab-chart.component'

@Component({
  selector: 'total-window-chart-component',
  templateUrl: 'line-chart.component.html',
})
export class TotalWindowChartComponent extends BaseTabChartComponent {
  constructor() {
    super()
    this.setTitle('Total number of window ')
  }

  @Input()
  override set data(records: EventRecord[]) {
    const labels = records.map((record) => new Date(record.timestamp))
    const values = records.map((record) => record.windows)

    this.setChartData(labels, values, 'Windows')
  }
}
