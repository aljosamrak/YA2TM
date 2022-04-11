import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import {Chart, ChartConfiguration, ChartType, TooltipItem} from 'chart.js'
import {Database, Record} from '../../../model/Database'
import 'chartjs-adapter-moment'
import 'hammerjs'
import 'chartjs-plugin-zoom'
import zoomPlugin from 'chartjs-plugin-zoom'
import {DateRange} from '../history/tab-insights-component.component'
import {BaseChartDirective} from 'ng2-charts'

export const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
  black: 'rgb(0, 0, 0)',
}

@Component({
  selector: 'base-tab-chart-component',
  templateUrl: 'line-chart.component.html',
})
export class BaseTabChartComponent {
  private database: Database

  public lineChartType: ChartType = 'line'
  public lineChartData: ChartConfiguration['data'] = {datasets: []}

  @ViewChild(BaseChartDirective) protected chart: BaseChartDirective | undefined

  @Output()
  dataRangeOutput = new EventEmitter<DateRange>()

  @Input()
  set data(records: Record[]) {}

  @Input()
  set dateRange(dateRange: DateRange) {
    if (this.chart && this.chart.chart) {
      this.chart.chart.zoomScale('x', dateRange)
    }
  }

  setChartData(labels: Date[], values: number[]) {
    if (this.chart && this.chart.chart) {
      this.chart.chart.data.datasets[0].data = values
      this.chart.chart.data.labels = labels
      this.chart.chart.stop() // make sure animations are not running
      this.chart.chart.update('none')
    }
  }

  footer = (tooltipItems: TooltipItem<any>[]) => {
    let sum = 0

    tooltipItems.forEach(function (tooltipItem) {
      sum += tooltipItem.parsed.y
    })
    return 'Sum: ' + sum
  }

  onZoomPanChange(context: {chart: Chart}) {
    const {min, max} = context.chart.scales['x']
    this.dataRangeOutput.emit({min, max})
  }

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        borderWidth: 0,
        radius: 0,
        hitRadius: 3, // Extra radius added to point radius for hit detection.
      },
    },
    plugins: {
      title: {
        display: true,
      },
      legend: {
        display: false,
      },
      //TODO
      decimation: {
        enabled: true,
        algorithm: 'min-max',
      },
      zoom: {
        limits: {
          x: {
            // TODO better, maybe injected from top?
            max: Date.now(),
          },
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          mode: 'x',
          onZoomComplete: this.onZoomPanChange.bind(this),
        },
        pan: {
          enabled: true,
          mode: 'x',
          onPanComplete: this.onZoomPanChange.bind(this),
        },
      },
      tooltip: {
        callbacks: {
          footer: this.footer.bind(this),
        },
      },
    },
    scales: {
      x: {
        type: 'time',
      },
      y: {
        // Add y-axis scale that can be referenced and changed later
      },
    },
    transitions: {
      zoom: {
        animation: {
          duration: 1000,
          easing: 'easeOutCubic',
        },
      },
    },
  }

  /**
   * Sets the title of the chart.
   */
  setTitle(title: string) {
    if (this.lineChartOptions?.plugins?.title) {
      this.lineChartOptions.plugins.title.text = title
    }
  }

  constructor(@Inject('Database') database: Database) {
    this.database = database

    // Add zoom plugin
    Chart.register(zoomPlugin)

    this.lineChartData = {
      datasets: [
        {
          data: [],
          label: 'Series A',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: CHART_COLORS.green,
          borderWidth: 1,
          tension: 0.2,
          normalized: true,
          spanGaps: true,
        },
      ],
      labels: [],
    }
  }
}
