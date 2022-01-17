import "reflect-metadata"
import { BadgeControllerImpl, hslToHex } from "../background/BadgeControllerImpl"
import { container } from "../inversify/inversify.config"
import { TYPES } from "../inversify/types"
import { mockLocalStorage } from "./MockLocalStorage"

describe("BadgeControllerImpl tests", () => {

  let SUT: BadgeControllerImpl

  beforeAll(async () => {
    container
      .rebind(TYPES.LocalStorageService)
      .toConstantValue(mockLocalStorage)

    SUT = new BadgeControllerImpl(container.get(TYPES.LocalStorageService))
  })

  describe("getBadgeColor number of tabs equals desired tabs", () => {
    it("should equal yellow", async () => {
      const i = SUT.getBadgeColor(20, 20)
      expect(i).toBe(hslToHex(60, 50, 50))
    })
  })
})
