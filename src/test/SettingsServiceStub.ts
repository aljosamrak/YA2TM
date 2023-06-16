import { BehaviorSubject } from 'rxjs'

import { UserPreferences } from '../app/settings/model/user-preferences'

export class SettingsServiceStub {
  userPreferences = new UserPreferences()
  userPreferences$ = new BehaviorSubject(this.userPreferences)

  getUserPreferences() {
    return this.userPreferences
  }

  getUserPreferencesCopy() {
    return Object.assign({}, this.userPreferences)
  }

  updateUserPreferences(newValue: UserPreferences) {
    this.userPreferences = newValue
    this.userPreferences$.next(newValue)
  }
}
