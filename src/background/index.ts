import { container } from '../inversify/inversify.config'
import { TYPES } from '../inversify/types'
import { TabController } from '../controller/tab/TabController'

// Create Tab controller
container.get<TabController>(TYPES.TabController)
