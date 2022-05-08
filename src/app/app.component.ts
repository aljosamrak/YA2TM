import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { UserPreferences } from './settings/model/user-preferences'
import { SettingsService } from './settings/service/settings.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  subscription?: Subscription

  title = 'YA2TM'

  tabsEnabled?: boolean
  drillDownEnabled?: boolean
  duplicateEnabled?: boolean
  achievementsEnabled?: boolean

  settingsLastClicked = 0
  settingsNumClicked = 0

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.subscription = this.settingsService.userPreferences$.subscribe(
      (item: UserPreferences) => {
        this.tabsEnabled = item.tabsEnabled
        this.drillDownEnabled = item.drillDownEnabled
        this.duplicateEnabled = item.deduplicateTabs
        this.achievementsEnabled = item.achievementsEnabled
      },
    )
  }

  openFullScreen() {
    window.open(chrome.runtime.getURL('index.html'))
  }

  settingsClick() {
    if (Date.now() - this.settingsLastClicked < 1000) {
      this.settingsNumClicked++
    } else {
      this.settingsNumClicked = 1
    }
    this.settingsLastClicked = Date.now()

    if (this.settingsNumClicked >= 5) {
      this.settingsService.enableExperiments()
    }
  }
}
