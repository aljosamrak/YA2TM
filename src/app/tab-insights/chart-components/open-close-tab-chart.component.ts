import { Component, Input } from '@angular/core'
import 'chartjs-adapter-moment'
import 'chartjs-plugin-zoom'
import 'hammerjs'

import { EventRecord, TrackedEvent } from '../../storage/model/EventRecord'
import { BaseTabChartComponent } from './base-tab-chart.component'

export const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
}

@Component({
  selector: 'open-close-tab-chart-component',
  templateUrl: 'line-chart.component.html',
})
export class OpenCloseTabChartComponent extends BaseTabChartComponent {
  constructor() {
    super()
    this.setTitle('Number of opened and closed tabs')
  }

  @Input()
  override set data(records: EventRecord[]) {
    if (records.length <= 0) {
      return
    }

    const [labels, values] = this.window<[number, number]>(
      records,
      [0, 0],
      ([opened, closed], record) => {
        return [
          opened + (record.event === TrackedEvent.TabOpened ? 1 : 0),
          closed + (record.event === TrackedEvent.TabClosed ? 1 : 0),
        ]
      },
    )

    this.lineChartData = {
      datasets: [
        {
          data: values.map(([opened, closed]) => opened),
          label: 'Series A',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: CHART_COLORS.red,
          borderWidth: 1,
          tension: 0.2,
          normalized: true,
          spanGaps: true,
        },
        {
          data: values.map(([opened, closed]) => closed),
          label: 'Series A',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
          tension: 0.2,
          normalized: true,
          spanGaps: true,
        },
      ],
      labels: labels,
    }

    // TODO
    if (this.chart && this.chart.chart) {
      this.chart.chart.stop() // make sure animations are not running
      this.chart.chart.update('none')
    }
  }
}
