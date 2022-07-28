import { Component, Input } from '@angular/core'
import 'chartjs-adapter-moment'
import 'chartjs-plugin-zoom'
import 'hammerjs'

import { EventRecord } from '../../storage/model/EventRecord'
import { BaseTabChartComponent } from './base-tab-chart.component'
import { SettingsService } from '../../settings/service/settings.service'

@Component({
  selector: 'total-window-chart-component',
  templateUrl: 'line-chart.component.html',
})
export class TotalWindowChartComponent extends BaseTabChartComponent {
  constructor(settingsService: SettingsService) {
    super(settingsService)
    this.setTitle('Total number of window ')
  }

  @Input()
  override set data(records: EventRecord[]) {
    if (records.length <= 0) {
      return
    }

    const [labels, values] = this.window(
      records,
      0,
      (_, record) => record.windows,
    )

    this.setChartData(labels, [{ values, label: 'Windows' }])
  }
}
