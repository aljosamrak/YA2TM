import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TotalTabChartComponent } from './total-tab-chart.component'

describe('TotalTabChartComponentComponent', () => {
  let component: TotalTabChartComponent
  let fixture: ComponentFixture<TotalTabChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotalTabChartComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalTabChartComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
