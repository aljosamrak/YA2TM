import { Component, OnInit } from '@angular/core'

import { OpenTab } from '../storage/model/OpenTab'
import { DatabaseService } from '../storage/service/database.service'
import groupBy from '../util/utils'

@Component({
  selector: 'app-drill-down',
  templateUrl: './drill-down.component.html',
  styleUrls: ['./drill-down.component.scss'],
})
export class DrillDownComponent implements OnInit {
  recordMap?: Map<string, OpenTab[]>

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    const currentTime = new Date().getTime()
    this.databaseService
      .getOpenTabs()
      .then((_data) => {
        this.recordMap = groupBy(_data, (openTab: OpenTab) =>
          new Date(openTab?.createdTimestamp ?? currentTime)
            .setHours(0, 0, 0, 0)
            .toString(),
        )
      })
      .catch((err) => console.error(err.message))
  }

  toDate(timestamp: string) {
    return new Date(parseInt(timestamp, 10)).toDateString()
  }
}
