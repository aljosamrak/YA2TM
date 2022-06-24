import { Component, Input, OnInit } from '@angular/core'
import { Chart } from 'chart.js'
import 'chartjs-adapter-moment'
import annotationPlugin from 'chartjs-plugin-annotation'
import 'chartjs-plugin-zoom'
import 'hammerjs'

import { EventRecord, TrackedEvent } from '../../storage/model/EventRecord'
import { BaseTabChartComponent, CHART_COLORS } from './base-tab-chart.component'

@Component({
  selector: 'diff-tab-chart-component',
  templateUrl: 'line-chart.component.html',
})
export class DiffTabChartComponent
  extends BaseTabChartComponent
  implements OnInit
{
  constructor() {
    super()
    // Add annotation plugin to the graph
    Chart.register(annotationPlugin)
    this.setTitle('Tab number difference')
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
  override set data(records: EventRecord[]) {
    if (records.length <= 0) {
      return
    }

    const [labels, values] = this.window(records, 0, (value, record) => {
      // TODO maybe get from total tabs
      if (record.event === TrackedEvent.TabOpened) {
        return value + 1
      } else if (record.event === TrackedEvent.TabClosed) {
        return value - 1
      }
      return value
    })

    this.setChartData(labels, values)
  }
}
