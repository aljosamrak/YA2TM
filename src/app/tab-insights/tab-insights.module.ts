import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {BaseTabChartComponent} from './chart-components/base-tab-chart.component'
import {OpenCloseTabChartComponent} from './chart-components/open-close-tab-chart.component'
import {DiffTabChartComponent} from './chart-components/diff-tab-chart.component'
import {EventTabChartComponent} from './chart-components/event-tab-chart.component'
import {TotalTabChartComponent} from './chart-components/total-tab-chart.component'
import {TotalWindowChartComponent} from './chart-components/total-window-chart.component'
import {NgChartsModule} from 'ng2-charts'
import {TabInsightsComponent} from './history/tab-insights-component.component'

@NgModule({
  declarations: [
    TabInsightsComponent,
    BaseTabChartComponent,
    DiffTabChartComponent,
    EventTabChartComponent,
    OpenCloseTabChartComponent,
    TotalTabChartComponent,
    TotalWindowChartComponent,
  ],
  exports: [TabInsightsComponent],
  imports: [CommonModule, NgChartsModule],
})
export class TabInsightsModule {}
