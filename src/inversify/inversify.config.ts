import 'reflect-metadata'
import { Container } from 'inversify'
import { Database } from '../database/Database'
import { IndexedDBDatabase } from '../database/IndexedDBDatabase'
import SERVICE_IDENTIFIER from './identifiers'

const container = new Container()
container.bind<Database>(SERVICE_IDENTIFIER.DatabaseService).to(IndexedDBDatabase)

export { container }
