import { Component, Input } from '@angular/core'

import { ChromeApiService } from '../chrome/chrome-api.service'

export type Tab = {
  title?: string
  windowId?: number
  favIconUrl?: string
  id?: number
}

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  tab: Tab = {}

  constructor(private chromeApiService: ChromeApiService) {}

  @Input()
  set setTabId(id: number) {
    this.chromeApiService.getTab(id).then((tab) => {
      this.tab = tab
    })
  }

  openTab(id: number, windowId: number) {
    this.chromeApiService.updateTab(id, { selected: true })
    this.chromeApiService.updateWindow(windowId, { focused: true })
  }
}
