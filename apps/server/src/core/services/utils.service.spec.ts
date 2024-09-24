import { TableColumn } from 'typeorm'

import { UtilsService } from './utils.service'

import { AbstractEntity } from '@core/entities'

describe('UtilsService', () => {
  describe('toDto', () => {
    class MockDto {
      id: number
      name: string

      constructor(entity: MockEntity) {
        this.id = entity.id
        this.name = entity.name
      }
    }

    class MockEntity extends AbstractEntity<MockDto> {
      constructor(
        public id: number,
        public name: string,
      ) {
        super()
      }

      dtoClass = MockDto
    }

    it('should convert a single entity to DTO', () => {
      // Arrange
      const entity = new MockEntity(1, 'John Doe')
      const expectedDto = { id: 1, name: 'John Doe' }

      // Act
      const dto = UtilsService.toDto(MockDto, entity)

      // Assert
      expect(dto).toEqual(expectedDto)
    })

    it('should convert an array of entities to an array of DTOs', () => {
      // Arrange
      const entities = [new MockEntity(1, 'John Doe'), new MockEntity(2, 'Jane Smith')]
      const expectedDtos = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ]

      // Act
      const dtos = UtilsService.toDto(MockDto, entities)

      // Assert
      expect(dtos).toEqual(expectedDtos)
    })
  })

  describe('toPrimaryColumnOptions', () => {
    it('should convert a TableColumn to PrimaryColumnOptions', () => {
      // Arrange
      const tableColumn = { name: 'id', type: 'integer' } as TableColumn
      const expectedOptions = { name: 'id', type: 'integer' }

      // Act
      const options = UtilsService.toPrimaryColumnOptions(tableColumn)

      // Assert
      expect(options).toEqual(expectedOptions)
    })
  })

  describe('toColumnOptions', () => {
    it('should convert a TableColumn to ColumnCommonOptions', () => {
      // Arrange
      const tableColumn = { name: 'name', type: 'varchar' } as TableColumn
      const expectedOptions = { name: 'name', type: 'varchar' }

      // Act
      const options = UtilsService.toColumnOptions(tableColumn)

      // Assert
      expect(options).toEqual(expectedOptions)
    })
  })
})
