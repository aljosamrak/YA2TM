import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChromeApiStub } from '../../../test/ChromeApiStub'
import { ChromeApiService } from '../../chrome/chrome-api.service'
import { DuplicatesComponent } from './duplicates.component'

describe('DuplicatesComponent', () => {
  let component: DuplicatesComponent
  let fixture: ComponentFixture<DuplicatesComponent>

  let chromeApiStub: ChromeApiStub

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuplicatesComponent],
      providers: [{ provide: ChromeApiService, useClass: ChromeApiStub }],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicatesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    chromeApiStub = TestBed.inject(ChromeApiService) as unknown as ChromeApiStub
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('distinct urls should not be deduplicated', async () => {
    chromeApiStub.setTabs(['url1', 'url2'])

    await component.ngOnInit()

    expect(component.duplicates.map((tab) => tab.url)).toEqual([])
  })

  it('same urls should be deduplicated', async () => {
    chromeApiStub.setTabs(['url1', 'url1'])

    await component.ngOnInit()

    expect(component.duplicates.map((tab) => tab.url)).toEqual(['url1', 'url1'])
  })
})
