import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { DataSource, QueryRunner, Table, Logger as OrmLogger } from 'typeorm'
import { importClassesFromDirectories } from 'typeorm/util/DirectoryExportedClassesLoader'
import { PostgresDriver } from 'typeorm/driver/postgres/PostgresDriver'

import { Seed, SeedClass, SeedInterface, TypeOrmSeedModuleOptions } from './types'

@Injectable()
export class DatabaseSeedService {
  private readonly logger = new Logger(DatabaseSeedService.name)

  private readonly dataSource: DataSource
  private readonly options: TypeOrmSeedModuleOptions
  private readonly seedsDatabase?: string
  private readonly seedsSchema?: string
  private readonly seedsTable: string
  private readonly seedsTableName: string = 'seeds'

  private seeds: SeedInterface[] | null = null

  constructor(dataSource: DataSource, options: TypeOrmSeedModuleOptions) {
    this.dataSource = dataSource
    this.options = options

    const { schema } = (this.dataSource.driver as PostgresDriver).options
    const database = this.dataSource.driver.database
    this.seedsDatabase = database
    this.seedsSchema = schema

    if (options.seedsTableName) {
      this.seedsTableName = options.seedsTableName
    }

    this.seedsTable = this.dataSource.driver.buildTableName(this.seedsTableName, schema, database)
  }

  async executePendingSeeds() {
    await this.loadSeedsIfNotExist()
    const pendingSeeds = await this.getPendingSeeds()

    for (const seed of pendingSeeds) {
      await this.executeSeed(seed)
    }
  }

  private executeSeed(seed: Seed) {
    return this.withQueryRunner(async (queryRunner) => {
      await this.createMigrationsTableIfNotExist(queryRunner)
      await seed.instance?.up(queryRunner)
      await this.insertExecutedSeed(queryRunner, seed)

      return seed
    })
  }

  private async withQueryRunner<T>(callback: (queryRunner: QueryRunner) => T | Promise<T>) {
    const queryRunner = this.dataSource.createQueryRunner()

    try {
      return await callback(queryRunner)
    } finally {
      await queryRunner.release()
    }
  }

  private async getExecutedSeeds(): Promise<Seed[]> {
    return this.withQueryRunner(async (queryRunner) => {
      await this.createMigrationsTableIfNotExist(queryRunner)

      return this.loadExecutedSeeds(queryRunner)
    })
  }

  private async getPendingSeeds(): Promise<Seed[]> {
    const allSeeds = this.getAllSeeds()
    const executedSeeds = await this.getExecutedSeeds()

    return allSeeds.filter((seed) => !executedSeeds.find((executedSeed) => executedSeed.name === seed.name))
  }

  private getAllSeeds(): Seed[] {
    if (!this.seeds) {
      throw new Error('Seeds are missing')
    }

    const seeds = this.seeds.map((seed) => {
      const seedClassName = seed.constructor.name
      const seedTimestamp = parseInt(seedClassName.slice(-13), 10)

      if (!seedTimestamp || isNaN(seedTimestamp)) {
        throw new InternalServerErrorException(
          `${seedClassName} seed name is wrong. Seed class name should have a JavaScript timestamp appended.`,
        )
      }

      return new Seed(undefined, seedTimestamp, seedClassName, seed)
    })

    this.checkForDuplicateSeeds(seeds)

    return seeds.sort((a, b) => a.timestamp - b.timestamp)
  }

  private async loadExecutedSeeds(queryRunner: QueryRunner): Promise<Seed[]> {
    const seedsRaw: Record<string, string>[] = await this.dataSource.manager
      .createQueryBuilder(queryRunner)
      .select()
      .orderBy(this.dataSource.driver.escape('id'), 'DESC')
      .from(this.seedsTable, this.seedsTableName)
      .getRawMany()

    return seedsRaw.map((seedRaw) => {
      return new Seed(parseInt(seedRaw['id']), parseInt(seedRaw['timestamp']), seedRaw['name'])
    })
  }

  private async insertExecutedSeed(queryRunner: QueryRunner, seed: Seed): Promise<void> {
    const values: Record<string, string | number> = {}

    values['timestamp'] = seed.timestamp
    values['name'] = seed.name

    const qb = queryRunner.manager.createQueryBuilder()
    await qb.insert().into(this.seedsTable).values(values).execute()
  }

  private async createMigrationsTableIfNotExist(queryRunner: QueryRunner): Promise<void> {
    const tableExist = await queryRunner.hasTable(this.seedsTable)

    if (!tableExist) {
      await queryRunner.createTable(
        new Table({
          database: this.seedsDatabase,
          schema: this.seedsSchema,
          name: this.seedsTable,
          columns: [
            {
              name: 'id',
              type: this.dataSource.driver.normalizeType({
                type: this.dataSource.driver.mappedDataTypes.migrationId,
              }),
              isGenerated: true,
              generationStrategy: 'increment',
              isPrimary: true,
              isNullable: false,
            },
            {
              name: 'timestamp',
              type: this.dataSource.driver.normalizeType({
                type: this.dataSource.driver.mappedDataTypes.migrationTimestamp,
              }),
              isPrimary: false,
              isNullable: false,
            },
            {
              name: 'name',
              type: this.dataSource.driver.normalizeType({
                type: this.dataSource.driver.mappedDataTypes.migrationName,
              }),
              isNullable: false,
            },
          ],
        }),
      )
    }
  }

  private async loadSeedsIfNotExist(): Promise<void> {
    if (this.seeds !== null) {
      return
    }

    const seeds = await this.buildSeeds(this.options.seeds || [])
    this.seeds = seeds
  }

  private async buildSeeds(seeds: (SeedClass | string)[]): Promise<SeedInterface[]> {
    const [seedClasses, seedDirectories] = splitClassesAndStrings(seeds)

    const allSeedClasses = [
      ...seedClasses,
      ...(await importClassesFromDirectories(this.logger as unknown as OrmLogger, seedDirectories)),
    ] as SeedClass[]

    return allSeedClasses.map((seed) => new seed())
  }

  protected checkForDuplicateSeeds(seeds: Seed[]) {
    const seedNames = seeds.map((seed) => seed.name)
    const duplicates = Array.from(
      new Set(seedNames.filter((migrationName, index) => seedNames.indexOf(migrationName) < index)),
    )

    if (duplicates.length > 0) {
      throw Error(`Duplicate seeds: ${duplicates.join(', ')}`)
    }
  }
}

const splitClassesAndStrings = <T>(classesAndStrings: (string | T)[]): [T[], string[]] => {
  return [
    classesAndStrings.filter((cls): cls is T => typeof cls !== 'string'),
    classesAndStrings.filter((str): str is string => typeof str === 'string'),
  ]
}
