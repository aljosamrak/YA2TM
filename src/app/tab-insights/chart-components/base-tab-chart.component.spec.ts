import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EventRecord, TrackedEvent } from '../../storage/model/EventRecord'
import { BaseTabChartComponent } from './base-tab-chart.component'

describe('BaseTabChartComponentComponent', () => {
  let component: BaseTabChartComponent
  let fixture: ComponentFixture<BaseTabChartComponent>

  const FUN = () => 0

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseTabChartComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseTabChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('window', () => {
    it('no data should return no data', () => {
      const result = component.window([], 0, FUN)

      expect(result).toBe([])
    })

    it('equally spaced data should be split equally', () => {
      const [dates] = component.window(createTabTimes(1, 2, 3, 4), 0, FUN, 2)

      expect(dates.map((date) => date.getTime())).toBe([2, 4])
    })

    it('unequal spaced data should be split equally', () => {
      const [dates] = component.window(createTabTimes(1, 3, 4, 10), 0, FUN, 2)

      expect(dates.map((date) => date.getTime())).toBe([4, 10])
    })

    it('pause longer then window length should       be split equally', () => {
      const [dates] = component.window(createTabTimes(1, 8, 10), 0, FUN, 3)

      expect(dates.map((date) => date.getTime())).toEqual([1, 10])
    })
  })
})

function createTabTimes(...times: number[]): EventRecord[] {
  return times.map((time) => ({
    timestamp: time,
    event: TrackedEvent.TabOpened,
    url: '',
    windows: 0,
    tabs: 0,
  }))
}
