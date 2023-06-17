import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

import { USER_PREFERENCES } from '../../storage/model/Key'
import { LocalStorageService } from '../../storage/service/local-storage.service'
import { UserPreferences } from '../model/user-preferences'

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private userPreferences = new BehaviorSubject<UserPreferences>(new UserPreferences())
  userPreferences$ = this.userPreferences.asObservable()
  private readonly subscription: (changes: { [p: string]: chrome.storage.StorageChange }) => void

  constructor(protected localstorageService: LocalStorageService) {
    localstorageService.get(USER_PREFERENCES).then((userPreferences) => {
      if (userPreferences) {
        this.updateUserPreferences(SettingsService.mergeDeep(new UserPreferences(), userPreferences))
      } else {
        this.updateUserPreferences(new UserPreferences())
      }
    })

    this.subscription = localstorageService.addOnNewValueListener(USER_PREFERENCES, (newValue) =>
      this.updateUserPreferences(newValue),
    )
  }

  private static isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item)
  }

  /** Deep merge two objects. */
  private static mergeDeep(target: any, ...sources: any): any {
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

  ngOnDestroy() {
    // prevent memory leak when a component is destroyed
    if (this.subscription) {
      this.localstorageService.removeOnChangeListener(this.subscription)
    }
  }

  updateUserPreferences(newValue: UserPreferences) {
    if (UserPreferences.equals(newValue, this.userPreferences.getValue())) {
      return
    }

    this.userPreferences.next(newValue)
    this.localstorageService.set(USER_PREFERENCES, newValue)
  }

  getUserPreferences(): UserPreferences {
    return this.userPreferences.getValue()
  }

  enableExperiments() {
    const settings: UserPreferences = this.getUserPreferences()
    settings.experimentsEnabled = true
    this.updateUserPreferences(settings)
  }
}
