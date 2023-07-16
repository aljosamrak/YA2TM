import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { environment } from '../../environments/environment'
import { UserPreferences } from '../settings/model/user-preferences'
import { SettingsService } from '../settings/service/settings.service'

@Component({
  selector: 'popup-root',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
  subscription?: Subscription

  tabsEnabled?: boolean
  drillDownEnabled?: boolean
  duplicateEnabled?: boolean
  achievementsEnabled?: boolean
  snoozingEnabled?: boolean

  settingsLastClicked = 0
  settingsNumClicked = 0

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.subscription = this.settingsService.userPreferences$.subscribe((item: UserPreferences) => {
      this.tabsEnabled = item.tabsEnabled
      this.drillDownEnabled = item.drillDownEnabled
      this.duplicateEnabled = item.deduplicateTabs
      this.achievementsEnabled = item.achievementsEnabled
      this.snoozingEnabled = item.snoozingEnabled
    })
  }

  openFullScreen() {
    // @@extension_id -> from locale replace
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

  isDevelopMode() {
    return !environment.production
  }
}
