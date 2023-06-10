import { BehaviorSubject } from 'rxjs'

import { UserPreferences } from '../app/settings/model/user-preferences'

export class SettingsServiceStub {
  userPreferences = new UserPreferences()
  userPreferences$ = new BehaviorSubject(this.userPreferences)

  getUserPreferences() {
    return this.userPreferences
  }
  updateUserPreferences() {
    this.userPreferences$.next(this.userPreferences)
  }
}
