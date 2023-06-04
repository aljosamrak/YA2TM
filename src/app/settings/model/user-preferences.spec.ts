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

      expect(userPreferences.equals(userPreferences)).toBeTrue()
    })

    it('two default objets are equal', () => {
      expect(userPreferences.equals(new UserPreferences())).toBeTrue()
    })

    it('two similar objets are equal', () => {
      userPreferences.deduplicateDontDeduplicateUrls = 'url'
      const other = new UserPreferences()
      other.deduplicateDontDeduplicateUrls = 'url'

      expect(userPreferences.equals(other)).toBeTrue()
    })

    it('two different objets are not equal', () => {
      userPreferences.favoriteColor = 'color'

      expect(userPreferences.equals(new UserPreferences())).toBeFalse()
    })
  })
})
