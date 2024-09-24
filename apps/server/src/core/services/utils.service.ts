import { ColumnType, PrimaryColumnOptions, TableColumn } from 'typeorm'
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions'

export class UtilsService {
  static toDto<T, E>(model: new (entity: E, options?: any) => T, entity: E, options?: any): T
  static toDto<T, E>(model: new (entity: E, options?: any) => T, entity: E[], options?: any): T[]
  static toDto<T, E>(model: new (entity: E, options?: any) => T, entity: E | E[], options?: any): T | T[] {
    if (Array.isArray(entity)) {
      return entity.map((u) => new model(u, options))
    }

    return new model(entity, options)
  }

  static toPrimaryColumnOptions(tableColumn: TableColumn): PrimaryColumnOptions {
    return {
      ...tableColumn,
      type: tableColumn.type as ColumnType,
    }
  }

  static toColumnOptions(tableColumn: TableColumn): ColumnCommonOptions {
    return {
      ...tableColumn,
    }
  }
}
