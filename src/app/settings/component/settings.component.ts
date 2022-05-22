import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { throttleTime } from 'rxjs/operators'
import { AnalyticsService } from '../../analytics/analytics.service'
import { DatabaseService } from '../../storage/service/database.service'
import { BadgeTextType, UserPreferences } from '../model/user-preferences'
import { SettingsService } from '../service/settings.service'

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass'],
})
export class SettingsComponent implements OnInit {
  subscription?: Subscription

  settingsForm: FormGroup

  experimentsEnabled?: boolean
  badgeEnabled?: boolean

  public FileType2LabelMapping: Record<any, string> = {
    [BadgeTextType.TABS_NUM]: 'Number of tabs',
    [BadgeTextType.WINDOW_NUM]: 'Number of Windows',
    [BadgeTextType.DEDUPLICATED_TABS]: 'Number of deduplicated tabs',
    [BadgeTextType.DAY_DIFF]: 'Tab difference',
  }
  public fileTypes = Object.values(BadgeTextType).filter(
    (value) => typeof value === 'number',
  )

  constructor(
    private analytics: AnalyticsService,
    private databaseService: DatabaseService,
    private router: Router,
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
  ) {
    // create form group using the form builder
    this.settingsForm = this.createGroup(
      formBuilder,
      settingsService.getUserPreferences(),
    )

    this.settingsForm.valueChanges.subscribe((formValue) => {
      this.badgeEnabled = formValue.badgeEnabled
      settingsService.updateUserPreferences(formValue)
    })
  }

  ngOnInit() {
    this.subscription = this.settingsService.userPreferences$
      .pipe(throttleTime(100))
      .subscribe((item: UserPreferences) => {
        this.experimentsEnabled = item.experimentsEnabled
        this.settingsForm.patchValue(item)
      })
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
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
