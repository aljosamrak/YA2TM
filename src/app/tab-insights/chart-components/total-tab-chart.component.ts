import { Component, Input, OnInit } from '@angular/core'
import { LinearScaleOptions } from 'chart.js'
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
  implements OnInit
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

  ngOnInit(): void {
    // Start graph at zero
    if (this.lineChartOptions?.scales) {
      const lineScale = this.lineChartOptions.scales['y'] as LinearScaleOptions
      lineScale.beginAtZero = true
    }
  }
}
