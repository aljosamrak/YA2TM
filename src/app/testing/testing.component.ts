import { Component } from '@angular/core'

import { LocalStorageService } from '../storage/service/local-storage.service'

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.sass'],
})
export class TestingComponent {
  localStorageResult: Status = Status.NOT_RUN

  constructor(private localstorageService: LocalStorageService) {}

  async testLocalStorage() {
    const value = 'value'
    const defaultValue = 'defaultValue'

    // Test read stored value
    const key = { key: 'testKey', defaultValue: () => '' }
    await this.localstorageService.set(key, value)
    const returnedValue1 = await this.localstorageService.get(key)

    if (returnedValue1 !== value) {
      this.localStorageResult = Status.FAILURE
      return
    }
    await chrome.storage.local.remove(key.key)

    // Remove key works
    const returnedValue2 = localStorage.getItem(key.key)
    if (returnedValue2) {
      this.localStorageResult = Status.FAILURE
      return
    }

    // Test default value
    const returnedValue3 = await this.localstorageService.get({
      key: 'unknownKey',
      defaultValue: () => defaultValue,
    })

    if (returnedValue3 !== defaultValue) {
      this.localStorageResult = Status.FAILURE
      return
    }
    await chrome.storage.local.remove('unknownKey')

    // Test on change callback
    await chrome.storage.local.remove('testKey2')
    let returnedValue4 = ''
    const fun = (changes: object) => {
      if (changes.hasOwnProperty('testKey2')) {
        // @ts-ignore
        returnedValue4 = changes['testKey2'].newValue
      }
    }
    this.localstorageService.addOnChangedListener(fun)
    await chrome.storage.local.set({ ['testKey2']: value })

    await new Promise<void>((resolve) => {
      while (!returnedValue4) {}
      resolve()
    })

    await chrome.storage.local.remove('testKey2')
    this.localstorageService.removeOnChangeListener(fun)

    this.localStorageResult = Status.SUCCESS
  }
}

enum Status {
  NOT_RUN = 'not-run',
  FAILURE = 'fail',
  SUCCESS = 'success',
}
