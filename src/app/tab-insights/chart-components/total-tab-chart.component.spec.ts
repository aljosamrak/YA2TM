import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SettingsServiceStub } from '../../../test/SettingsServiceStub'
import { SettingsService } from '../../settings/service/settings.service'
import { TotalTabChartComponent } from './total-tab-chart.component'

describe('TotalTabChartComponentComponent', () => {
  let component: TotalTabChartComponent
  let fixture: ComponentFixture<TotalTabChartComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotalTabChartComponent],
      providers: [{ provide: SettingsService, useClass: SettingsServiceStub }],
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
