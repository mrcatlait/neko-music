import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { DataSource, ObjectLiteral, QueryRunner, Table } from 'typeorm'

export interface SeedInterface {
  up(queryRunner: QueryRunner): Promise<any>
  down(queryRunner: QueryRunner): Promise<any>
}

export class Seed {
  id: number | undefined
  timestamp: number
  name: string
  instance?: SeedInterface

  constructor(id: number | undefined, timestamp: number, name: string, instance?: SeedInterface) {
    this.id = id
    this.timestamp = timestamp
    this.name = name
    this.instance = instance
  }
}

type SeedClass = new () => SeedInterface

@Injectable()
export class DatabaseSeedService {
  private readonly seedsDatabase?: string
  private readonly seedsSchema?: string
  private readonly seedsTable: string
  private readonly seedsTableName = 'seeds'

  private seeds: SeedInterface[] = []

  constructor(private readonly dataSource: DataSource) {
    const { schema } = this.dataSource.driver.options as any
    const database = this.dataSource.driver.database
    this.seedsDatabase = database
    this.seedsSchema = schema
    this.seedsTable = this.dataSource.driver.buildTableName(this.seedsTableName, schema, database)
  }

  async executePendingSeeds(seeds: SeedClass[]) {
    this.seeds = seeds.map((seed) => new seed())
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
    const seeds = this.seeds.map((seed) => {
      const seedClassName = (seed.constructor as any).name
      const seedTimestamp = parseInt(seedClassName.substr(-13), 10)

      if (!seedTimestamp || isNaN(seedTimestamp)) {
        throw new InternalServerErrorException(
          `${seedClassName} seed name is wrong. Seed class name should have a JavaScript timestamp appended.`,
        )
      }

      return new Seed(undefined, seedTimestamp, seedClassName, seed)
    })

    return seeds.sort((a, b) => a.timestamp - b.timestamp)
  }

  private async loadExecutedSeeds(queryRunner: QueryRunner): Promise<Seed[]> {
    const seedsRaw: ObjectLiteral[] = await this.dataSource.manager
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
    const values: ObjectLiteral = {}

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
}
