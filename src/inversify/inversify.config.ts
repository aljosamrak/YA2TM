import 'reflect-metadata'
import { Container } from 'inversify'
import { Database } from '../database/Database'
import { IndexedDBDatabase } from '../database/IndexedDBDatabase'
import TYPES from './identifiers'
import { Logger, logger } from '../services/Logger'

const container = new Container()
container.bind<Database>(TYPES.DatabaseService).to(IndexedDBDatabase)
container.bind<Logger>(TYPES.Logger).toConstantValue(logger);

export { container }
