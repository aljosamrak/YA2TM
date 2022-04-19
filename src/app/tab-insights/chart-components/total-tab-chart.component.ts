import { Component, Inject, Input, OnInit } from '@angular/core'
import { LinearScaleOptions } from 'chart.js'
import 'chartjs-adapter-moment'
import 'chartjs-plugin-zoom'
import 'hammerjs'
import { Database, Record } from '../../../model/Database'
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
  override set data(records: Record[]) {
    const labels = records.map((record) => new Date(record.timestamp))
    const values = records.map((record) => record.tabs)
    this.setChartData(labels, values)
  }

  constructor(@Inject('Database') database: Database) {
    super(database)
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
