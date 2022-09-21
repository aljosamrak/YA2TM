import { TestBed } from '@angular/core/testing'
import { LoggerTestingModule } from 'ngx-logger/testing'

import { AnalyticsService } from '../../analytics/analytics.service'
import { TrackedEvent } from '../model/EventRecord'
import { DatabaseService } from './database.service'

import arrayContaining = jasmine.arrayContaining

describe('DatabaseService', () => {
  const analyticSpy = jasmine.createSpyObj('AnalyticsService', [
    'event',
    'time',
  ])

  let service: DatabaseService

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [LoggerTestingModule],
      providers: [
        DatabaseService,
        { provide: AnalyticsService, useValue: analyticSpy },
      ],
    })

    service = TestBed.inject(DatabaseService)
  })

  afterEach(async () => {
    service.close()

    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DatabaseService.DATABASE_NAME)
      request.onsuccess = () => resolve()
      request.onerror = (event) => reject(event)
    })
  })

  it('should be created', async () => {
    expect(service).toBeTruthy()
  })

  describe('History', () => {
    const record = {
      timestamp: 1,
      event: TrackedEvent.TabOpened,
      url: 'url',
      windows: 1,
      tabs: 5,
    }

    it('should query the same object as inserted', async () => {
      await service.insert_records(record)
      const result = await service.query(0, 2)

      expect(result.length).toBe(1)
      expect(result).toContain(record)
    })

    it('should be able to store two objects with same timestamp', async () => {
      await service.insert_records(record)
      await service.insert_records(record)
      const result = await service.query(0, 2)

      expect(result.length).toBe(2)
      expect(result).toEqual(arrayContaining([record, record]))
    })
  })

  describe('Opened tabs', () => {
    const openTab = {
      index: 0,
      groupId: 0,
    }

    it('should query the same object as inserted', async () => {
      await service.addOpenTab(openTab)
      const result = await service.getOpenTabs()

      expect(result.length).toBe(1)
      expect(result).toContain(openTab)
    })
  })

  describe('Snoozed tabs', () => {
    const snoozedTab = {
      snoozedTimestamp: 1,
      unsnoozedTimestamp: 2,
      windowId: 0,
      index: 0,
    }

    it('should query the same object as inserted', async () => {
      await service.addSnoozedTab(snoozedTab)
      const result = await service.getSnoozedTabs()

      expect(result.length).toBe(1)
      expect(result).toContain(snoozedTab)
    })

    it('should be able to delete snoozed tab', async () => {
      await service.addSnoozedTab(snoozedTab)

      // Assume key is 1
      await service.removeSnoozedTab(1)

      const snoozendTabs = await service.getSnoozedTabs()
      expect(snoozendTabs).toEqual([])
    })

    it('should be able to store two snoozed tabs with same timestamp', async () => {
      await service.addSnoozedTab(snoozedTab)
      await service.addSnoozedTab(snoozedTab)
      const result = await service.getSnoozedTabs()

      expect(result.length).toBe(2)
      expect(result).toEqual(arrayContaining([snoozedTab, snoozedTab]))
    })
  })
})
