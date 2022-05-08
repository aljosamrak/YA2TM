import { Inject, Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { LocalStorage } from '../../../storage/LocalStorage'
import { UserPreferences } from '../model/user-preferences'

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
          this.mergeDeep(
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
    if (
      JSON.stringify(this.userPreferences.getValue()) ===
      JSON.stringify(newValue)
    ) {
      return
    }

    this.userPreferences.next(newValue)
    // TODO replace with a service
    return chrome.storage.local.set({ USER_PREFERENCES: newValue })
  }

  getUserPreferences(): UserPreferences {
    return JSON.parse(JSON.stringify(this.userPreferences.getValue()))
  }

  enableExperiments() {
    const settings: UserPreferences = this.getUserPreferences()
    settings.experimentsEnabled = true
    this.updateUserPreferences(settings)
  }

  /**
   * Deep merge two objects.
   * @param target
   * @param ...sources
   */
  private mergeDeep(target: any, ...sources: any): any {
    if (!sources.length) {
      return target
    }
    const source = sources.shift()

    if (SettingsService.isObject(target) && SettingsService.isObject(source)) {
      for (const key in source) {
        if (SettingsService.isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} })
          }
          this.mergeDeep(target[key], source[key])
        } else {
          Object.assign(target, { [key]: source[key] })
        }
      }
    }

    return this.mergeDeep(target, ...sources)
  }

  private static isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item)
  }
}
