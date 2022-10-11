import ExtensionPage from '../pageobjects/extension.page'

describe('Extension full screen', () => {
  it('opened', async () => {
    await ExtensionPage.open()

    await expect(await browser.checkScreen('full-screen-opened')).toEqual(0)
  })
})
