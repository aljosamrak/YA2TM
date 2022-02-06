const TYPES = {
  Logger: Symbol.for('Logger'),
  DatabaseService: Symbol.for('Database'),
  LocalStorageService: Symbol.for('LocalStorage'),

  // Models
  TabData: Symbol.for('TabData'),
  WindowData: Symbol.for('WindowData'),

  // Views
  BadgeView: Symbol.for('BadgeView'),

  // Controllers
  BadgeController: Symbol.for('BadgeController'),
  TabController: Symbol.for('TabController'),

  Analytics: Symbol.for('Analytics'),
}

export {TYPES}
