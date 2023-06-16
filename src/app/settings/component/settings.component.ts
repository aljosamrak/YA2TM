import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'
import { throttleTime } from 'rxjs/operators'

import { environment } from '../../../environments/environment'
import { AnalyticsService } from '../../analytics/analytics.service'
import { DatabaseService } from '../../storage/service/database.service'
import {
  BadgeTextType,
  DeduplicateStrategy,
  UserPreferences,
} from '../model/user-preferences'
import { SettingsService } from '../service/settings.service'

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass'],
})
export class SettingsComponent implements OnInit {
  subscription?: Subscription
  formSubscription: Subscription

  settingsForm: FormGroup

  applicationVersion = environment.version

  public FileType2LabelMapping: Record<any, string> = {
    [BadgeTextType.TABS_NUM]: 'Number of tabs',
    [BadgeTextType.WINDOW_NUM]: 'Number of Windows',
    [BadgeTextType.DEDUPLICATED_TABS]: 'Number of deduplicated tabs',
    [BadgeTextType.DAY_DIFF]: 'Tab difference',
  }
  public fileTypes = Object.values(BadgeTextType).filter(
    (value) => typeof value === 'number',
  )

  deduplicateStrategyMap: any[] = [
    { name: 'Remove new tab', id: DeduplicateStrategy.REMOVE_NEW_TAB },
    { name: 'Remove Old tab', id: DeduplicateStrategy.REMOVE_OLD_TAB },
    { name: 'Show notification', id: DeduplicateStrategy.NOTIFICATION },
  ]

  constructor(
    private analytics: AnalyticsService,
    private databaseService: DatabaseService,
    private formBuilder: FormBuilder,
    public settingsService: SettingsService,
  ) {
    // create form group using the form builder
    this.settingsForm = this.createGroup(
      formBuilder,
      settingsService.getUserPreferences(),
    )

    this.formSubscription = this.getFormSubscription()
  }

  ngOnInit() {
    this.subscription = this.settingsService.userPreferences$
      .pipe(throttleTime(100))
      .subscribe((item: UserPreferences) => {
        // Unsubscribe while patching to avoid the loop
        this.formSubscription.unsubscribe()
        this.settingsForm.patchValue(item)
        // Resubscribe after pathing the value
        this.formSubscription = this.getFormSubscription()
      })
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.formSubscription.unsubscribe()
    }
  }

  private getFormSubscription() {
    return this.settingsForm.valueChanges.subscribe((formValue) => {
      this.settingsService.updateUserPreferences(formValue)
    })
  }

  private createGroup(
    formBuilder: FormBuilder,
    userPreferences: UserPreferences,
  ): FormGroup {
    const group = new FormGroup({})

    Object.keys(userPreferences).forEach((key) => {
      const field = Reflect.get(userPreferences, key)
      if (field instanceof Object) {
        group.addControl(key, this.createGroup(formBuilder, field))
      } else {
        group.addControl(key, new FormControl(field))
      }
    })

    return group
  }

  clearTabData() {
    this.databaseService.deleteData()
  }

  resetSettings() {
    this.settingsService.updateUserPreferences(new UserPreferences())
  }

  resetUUID() {
    this.analytics.resetUuid()
  }
}
