import { GetImportMethodsUseCase } from './get-import-methods.use-case'
import { ImportStrategyFactory } from '../../strategies'

describe('GetImportMethodsUseCase', () => {
  it('should return import methods from strategy factory', async () => {
    // Arrange
    const importStrategyFactory = {
      getMethods: vi.fn().mockReturnValue([
        {
          key: 'youtube',
          name: 'YouTube',
          description: 'Import from YouTube.',
        },
      ]),
    } as unknown as ImportStrategyFactory

    const useCase = new GetImportMethodsUseCase(importStrategyFactory)

    // Act
    const result = await useCase.invoke()

    // Assert
    expect(importStrategyFactory.getMethods).toHaveBeenCalled()
    expect(result).toEqual([
      {
        key: 'youtube',
        name: 'YouTube',
        description: 'Import from YouTube.',
      },
    ])
  })
})
