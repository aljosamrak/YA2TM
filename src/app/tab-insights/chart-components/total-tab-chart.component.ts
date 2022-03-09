import {Component, Inject, Input, OnInit} from '@angular/core'
import {Database, Record} from '../../../model/Database'
import 'chartjs-adapter-moment'
import 'hammerjs'
import 'chartjs-plugin-zoom'
import {BaseTabChartComponent} from './base-tab-chart.component'
import {LinearScaleOptions} from 'chart.js'

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
