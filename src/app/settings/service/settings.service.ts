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
  private subscription: ((changes: { [p: string]: chrome.storage.StorageChange }) => void) | undefined

  constructor(protected localstorageService: LocalStorageService) {
    localstorageService.get(USER_PREFERENCES).then((userPreferences) => {
      if (userPreferences) {
        this.updateUserPreferences(SettingsService.mergeDeep(new UserPreferences(), userPreferences))
      } else {
        this.updateUserPreferences(new UserPreferences())
      }
    })
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
    this.userPreferences.next(newValue)
    this.subscription = undefined
    this.localstorageService.set(USER_PREFERENCES, newValue)
    this.subscription = this.localstorageService.addOnNewValueListener(USER_PREFERENCES, (_newValue) =>
      this.updateUserPreferences(_newValue),
    )
  }

  getUserPreferences(): UserPreferences {
    return this.userPreferences.getValue()
  }

  enableExperiments() {
    this.getUserPreferences().experimentsEnabled = true
    this.updateUserPreferences(this.getUserPreferences())
  }
}
