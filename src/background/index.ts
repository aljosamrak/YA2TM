import { Database } from '../storage/Database'
import { container } from '../inversify/inversify.config'
import { BadgeController } from './BadgeController'
import { TYPES } from '../inversify/types'
import { TabController } from '../controller/tab/TabController'

const database = container.get<Database>(TYPES.DatabaseService)
const badgeController = container.get<BadgeController>(TYPES.BadgeController)
const tabController = container.get<TabController>(TYPES.TabController)

tabController.setupListeners()

