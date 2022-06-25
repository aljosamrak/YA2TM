import { Component } from '@angular/core'

@Component({
  selector: 'app-drill-down',
  templateUrl: './drill-down.component.html',
  styleUrls: ['./drill-down.component.sass'],
})
export class DrillDownComponent {
  recordMap?: Record<string, any[]>

  toDate(timestamp: string) {
    return new Date(parseInt(timestamp, 10)).toDateString()
  }
}
