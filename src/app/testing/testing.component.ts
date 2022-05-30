import { Component } from '@angular/core'
import { LocalstorageService } from '../storage/service/localstorage.service'

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.sass']
})
export class TestingComponent  {
  localStorageResult: Status = Status.NOT_RUN

  constructor(private localstorageService: LocalstorageService) { }

  async testLocalStorage() {
    const value = 'value'
    const defaultValue = 'defaultValue'

    // Test read stored value
    const key = {key: 'testKey', defaultValue: () => ''}
    await this.localstorageService.set(key, value)
    const returnedValue1 = await this.localstorageService.get(key)

    if (returnedValue1 !== value) {
      this.localStorageResult = Status.FAILURE
      return
    }
    localStorage.removeItem(key.key)

    // Test default value
    const returnedValue2 = await this.localstorageService.get({key: 'unknownKey', defaultValue: () => defaultValue})

    if (returnedValue2 !== defaultValue) {
      this.localStorageResult = Status.FAILURE
      return
    }
    localStorage.removeItem('unknownKey')

    this.localStorageResult = Status.SUCCESS
  }
}

enum Status {
  NOT_RUN= 'not-run',
  FAILURE= 'fail',
  SUCCESS= 'success',
}
