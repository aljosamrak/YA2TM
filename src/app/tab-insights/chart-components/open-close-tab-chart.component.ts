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
    this.setTitle('Open close')
  }

  @Input()
  override set data(records: EventRecord[]) {
    if (records.length <= 0) {
      return
    }

    const windowTime =
      (records[records.length - 1].timestamp - records[0].timestamp) / 20
    const labels: Date[] = []
    const openValues: number[] = []
    const closeValues: number[] = []
    let nextWindowTime = records[0].timestamp + windowTime
    let openAggregation = 0
    let closeAggregation = 0
    records.forEach((record) => {
      if (record.timestamp > nextWindowTime) {
        labels.push(new Date(nextWindowTime))
        openValues.push(openAggregation)
        closeValues.push(closeAggregation)
        nextWindowTime += windowTime
        openAggregation = 0
        closeAggregation = 0
      }

      // TODO maybe get from total tabs
      if (record.event === TrackedEvent.TabOpened) {
        openAggregation += 1
      }
      if (record.event === TrackedEvent.TabClosed) {
        closeAggregation += 1
      }
    })

    this.lineChartData = {
      datasets: [
        {
          data: openValues,
          label: 'Series A',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: CHART_COLORS.red,
          borderWidth: 1,
          tension: 0.2,
          normalized: true,
          spanGaps: true,
        },
        {
          data: closeValues,
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
      // this.chart.chart.data.datasets[0].data = values
      // this.chart.chart.data.labels = labels
      this.chart.chart.stop() // make sure animations are not running
      this.chart.chart.update('none')
    }
  }
}
