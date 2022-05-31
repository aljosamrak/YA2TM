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
export class TotalTabChartComponent
  extends BaseTabChartComponent
{
  @Input()
  override set data(records: EventRecord[]) {
    const labels = records.map((record) => new Date(record.timestamp))
    const values = records.map((record) => record.tabs)
    this.setChartData(labels, values)
  }

  constructor() {
    super()
    this.setTitle('Total number of tabs')
  }
}
