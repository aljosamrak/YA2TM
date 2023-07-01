import { Component, OnInit } from '@angular/core'

import { DatabaseService } from '../../storage/service/database.service'
import { SnoozedTab } from '../model/SnoozedTab'

@Component({
  selector: 'snoozed-tabs',
  templateUrl: './snooze-tabs.component.html',
  styleUrls: ['./snooze-tabs.component.scss'],
})
export class SnoozedTabsComponent implements OnInit {
  snoozedTabs: Array<SnoozedTab> = []
  constructor(private databaseService: DatabaseService) {}

  async ngOnInit(): Promise<void> {
    this.snoozedTabs = await this.databaseService.getSnoozedTabs()
  }
}
