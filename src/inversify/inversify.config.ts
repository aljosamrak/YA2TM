import "reflect-metadata"
import { Container } from "inversify"
import { Database } from "../storage/Database"
import { IndexedDBDatabase } from "../storage/IndexedDBDatabase"
import { Logger, logger } from "../services/Logger"
import { LocalStorageImpl } from "../storage/LocalStorageImpl"
import { LocalStorage } from "../storage/LocalStorage"
import { TYPES } from "./types"

const container = new Container()
container.bind<Logger>(TYPES.Logger).toConstantValue(logger)
container.bind<Database>(TYPES.DatabaseService).to(IndexedDBDatabase)
container.bind<LocalStorage>(TYPES.LocalStorageService).to(LocalStorageImpl)

export { container }
