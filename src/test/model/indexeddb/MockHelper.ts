function mockNavigationStorage() {
  // const estimateMock = jest.fn().mockResolvedValue({})
  const estimateMock = jest.fn(() => Promise.resolve({data: {}}))
  Object.defineProperty(navigator, 'storage', {
    value: {
      estimate: estimateMock,
    },
    configurable: true,
  })
  return estimateMock
}

export {mockNavigationStorage}
