function mockNavigationStorage() {
  Object.defineProperty(navigator, 'storage', {
    value: new MockNavigator(),
    configurable: true,
  })
}

class MockNavigator {
  estimate() {
    return Promise.resolve({data: {}})
  }
}

export {mockNavigationStorage}
