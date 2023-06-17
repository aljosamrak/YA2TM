import { UserPreferences } from './user-preferences'

describe('UserPreferences', () => {
  let userPreferences: UserPreferences

  beforeEach(() => {
    userPreferences = new UserPreferences()
  })

  it('should create', () => {
    expect(userPreferences).toBeDefined()
  })

  describe('equals', () => {
    it('same object equals', () => {
      userPreferences.favoriteColor = 'color'

      expect(
        UserPreferences.equals(userPreferences, userPreferences),
      ).toBeTrue()
    })

    it('two default objets are equal', () => {
      expect(
        UserPreferences.equals(userPreferences, new UserPreferences()),
      ).toBeTrue()
    })

    it('two similar objets are equal', () => {
      userPreferences.deduplicateDontDeduplicateUrls = 'url'
      const other = new UserPreferences()
      other.deduplicateDontDeduplicateUrls = 'url'

      expect(UserPreferences.equals(userPreferences, other)).toBeTrue()
    })

    it('two different objets are not equal', () => {
      userPreferences.favoriteColor = 'color'

      expect(
        UserPreferences.equals(userPreferences, new UserPreferences()),
      ).toBeFalse()
    })
  })
})
