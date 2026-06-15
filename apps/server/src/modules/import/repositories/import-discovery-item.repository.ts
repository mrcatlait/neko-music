import { Injectable } from '@nestjs/common'

import { ImportSchema } from '../import.schema'

import { InjectDatabase } from '@/modules/database/database.injector'
import { Database } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

@Injectable()
export class ImportDiscoveryItemRepository extends Repository<ImportSchema, 'import.ImportDiscoveryItem'> {
  constructor(@InjectDatabase() database: Database<ImportSchema>) {
    super(database, 'import.ImportDiscoveryItem')
  }

  async setSelection(discoveryId: string, selectedItemIds: string[]): Promise<void> {
    await this.database
      .updateTable('import.ImportDiscoveryItem')
      .set({
        isSelected: false,
      })
      .where('discoveryId', '=', discoveryId)
      .execute()

    if (selectedItemIds.length === 0) {
      return
    }

    await this.database
      .updateTable('import.ImportDiscoveryItem')
      .set({
        isSelected: true,
      })
      .where('discoveryId', '=', discoveryId)
      .where('id', 'in', selectedItemIds)
      .execute()
  }
}
