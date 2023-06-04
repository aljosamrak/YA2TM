import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

import { USER_PREFERENCES } from '../../storage/model/Key'
import { LocalStorageService } from '../../storage/service/local-storage.service'
import { UserPreferences } from '../model/user-preferences'

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private userPreferences = new BehaviorSubject<UserPreferences>(
    new UserPreferences(),
  )
  userPreferences$ = this.userPreferences.asObservable()

  constructor(protected localstorageService: LocalStorageService) {
    localstorageService.get(USER_PREFERENCES).then((userPreferences) => {
      if (userPreferences) {
        this.updateUserPreferences(
          this.mergeDeep(new UserPreferences(), userPreferences),
        )
      } else {
        this.updateUserPreferences(new UserPreferences())
      }
    })

    localstorageService.addOnChangedListener((changes) => {
      if (changes.hasOwnProperty(USER_PREFERENCES.key)) {
        this.updateUserPreferences(
          // @ts-ignore
          changes[USER_PREFERENCES.key].newValue as UserPreferences,
        )
      }
    })
  }

  updateUserPreferences(newValue: UserPreferences) {
    if (this.userPreferences.getValue().equals(newValue)) {
      return
    }

    this.userPreferences.next(newValue)
    this.localstorageService.set(USER_PREFERENCES, newValue)
  }

  getUserPreferences(): UserPreferences {
    return JSON.parse(JSON.stringify(this.userPreferences.getValue()))
  }

  enableExperiments() {
    const settings: UserPreferences = this.getUserPreferences()
    settings.experimentsEnabled = true
    this.updateUserPreferences(settings)
  }

  /** Deep merge two objects. */
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
