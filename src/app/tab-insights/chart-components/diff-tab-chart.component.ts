import {Component, Inject, Input, OnInit} from '@angular/core'
import {Database, Record} from '../../../model/Database'
import 'chartjs-adapter-moment'
import 'hammerjs'
import 'chartjs-plugin-zoom'
import {BaseTabChartComponent, CHART_COLORS} from './base-tab-chart.component'
import {TrackedEvent} from '../../../model/TrackedEvent'
import annotationPlugin from 'chartjs-plugin-annotation'
import {Chart} from 'chart.js'

@Component({
  selector: 'diff-tab-chart-component',
  templateUrl: 'line-chart.component.html',
})
export class DiffTabChartComponent
  extends BaseTabChartComponent
  implements OnInit
{
  constructor(@Inject('Database') database: Database) {
    super(database)
    // Add annotation plugin to teh graph
    Chart.register(annotationPlugin)
    this.setTitle('Open close')
  }

  ngOnInit(): void {
    // https://www.chartjs.org/chartjs-plugin-annotation
    if (this?.lineChartOptions?.plugins) {
      this.lineChartOptions.plugins.annotation = {
        annotations: {
          zero: {
            drawTime: 'beforeDraw',
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: CHART_COLORS.black,
            borderWidth: 2,
          },
        },
      }
    }
  }

  @Input()
  override set data(records: Record[]) {
    const windowTime =
      (records[records.length - 1].timestamp - records[0].timestamp) / 20
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

      // TODO maybe get from total tabs
      if (record.event === TrackedEvent.TabOpened) {
        aggregation += 1
      } else if (record.event === TrackedEvent.TabClosed) {
        aggregation -= 1
      }
    })

    this.setChartData(labels, values)
  }
}