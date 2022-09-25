import { Injectable } from '@angular/core'

import AlarmCreateInfo = chrome.alarms.AlarmCreateInfo
import Alarm = chrome.alarms.Alarm

@Injectable({
  providedIn: 'root',
})
export class ChromeAlarmApiService {
  async create(name: string, alarmInfo: AlarmCreateInfo): Promise<void> {
    return chrome.alarms.create(name, alarmInfo)
  }

  async get(name: string): Promise<chrome.alarms.Alarm> {
    return chrome.alarms.get(name)
  }

  async getAll(): Promise<chrome.alarms.Alarm[]> {
    return chrome.alarms.getAll()
  }

  addListener(callback: (alarm: Alarm) => void) {
    chrome.alarms.onAlarm.addListener(callback)
  }
}
