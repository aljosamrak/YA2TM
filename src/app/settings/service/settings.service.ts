import { Inject, Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { LocalStorage } from '../../../storage/LocalStorage'
import { UserPreferences } from '../module/user-preferences'

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private userPreferences = new BehaviorSubject<UserPreferences>(
    new UserPreferences(),
  )
  userPreferences$ = this.userPreferences.asObservable()

  constructor(@Inject('LocalStorage') private localStorage: LocalStorage) {
    // TODO replace with a service
    chrome.storage.local.get('USER_PREFERENCES').then((userPreferences) => {
      if (userPreferences) {
        this.updateUserPreferences(
          Object.assign(
            new UserPreferences(),
            userPreferences['USER_PREFERENCES'],
          ),
        )
      } else {
        this.updateUserPreferences(new UserPreferences())
      }
    })
  }

  updateUserPreferences(newValue: UserPreferences) {
    this.userPreferences.next(newValue)
    // TODO replace with a service
    return chrome.storage.local.set({ USER_PREFERENCES: newValue })
  }

  getUserPreferences() {
    return this.userPreferences.getValue()
  }
}
