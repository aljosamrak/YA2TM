import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-drill-down',
  templateUrl: './drill-down.component.html',
  styleUrls: ['./drill-down.component.sass'],
})
export class DrillDownComponent implements OnInit {
  // recordMap?: Record<string, TabRelation[]>
  recordMap?: Record<string, any[]>

  constructor() {}

  ngOnInit(): void {
    // this.database.getTabs().then((_data) => {
    //   console.log(_data)
    //   const results = groupBy(_data, (tabRelation: TabRelation) =>
    //     new Date(tabRelation.createdTimestamp!).setHours(0, 0, 0, 0).toString(),
    //   )
    //   console.log(results)
    //   this.recordMap = results
    // })
  }

  toDate(timestamp: string) {
    return new Date(parseInt(timestamp, 10)).toDateString()
  }
}
