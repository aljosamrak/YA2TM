import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ChromeNotificationService {
  async create(options: chrome.notifications.NotificationOptions, callback?: (notificationId: string) => void) {
    chrome.notifications.create(options, callback)
  }
}
