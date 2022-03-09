import {Component, Inject, Input} from '@angular/core'
import {Database, Record} from '../../../model/Database'
import 'chartjs-adapter-moment'
import 'hammerjs'
import 'chartjs-plugin-zoom'
import {BaseTabChartComponent} from './base-tab-chart.component'

@Component({
  selector: 'total-window-chart-component',
  templateUrl: 'line-chart.component.html',
})
export class TotalWindowChartComponent extends BaseTabChartComponent {
  constructor(@Inject('Database') database: Database) {
    super(database)
    this.setTitle('Total number of window ')
  }

  @Input()
  override set data(records: Record[]) {
    const labels = records.map((record) => new Date(record.timestamp))
    const values = records.map((record) => record.windows)

    this.setChartData(labels, values)
  }
}
