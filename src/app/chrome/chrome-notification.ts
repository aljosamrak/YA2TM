import { Injectable } from '@angular/core'
import NotificationOptions = chrome.notifications.NotificationOptions

@Injectable({
  providedIn: 'root',
})
export class ChromeNotificationService {
  async create(options: NotificationOptions<true>, callback?: (notificationId: string) => void) {
    chrome.notifications.create(options, callback)
  }
}
