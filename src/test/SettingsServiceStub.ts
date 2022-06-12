import { Observable } from 'rxjs'

import { UserPreferences } from '../app/settings/model/user-preferences'

export class SettingsServiceStub {
  userPreferences$ = new Observable()

  userPreferences = new UserPreferences()

  getUserPreferences() {
    return this.userPreferences
  }
}
