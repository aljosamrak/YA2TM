/**
 * Extension page containing specific selectors and methods.
 */
class ExtensionPage {
  /**
   * overwrite specific options to adapt it to page object
   */
  public open() {
    return browser.url(
      `chrome-extension://bongnojclkgoledmoipgdkdpcbhcfkmd/index.html`,
    )
  }
}

export default new ExtensionPage()
