import { SagaStep } from './saga-step'

export abstract class Saga {
  private readonly compensationSteps: SagaStep<unknown>[] = []
  protected steps: SagaStep<unknown>[] = []

  async execute<Context>(context: Context): Promise<void> {
    try {
      for (const step of this.steps) {
        step.setContext(context)
        this.compensationSteps.push(step)
        await step.execute()
      }
    } catch (error) {
      await this.runCompensationFlow()
      throw error
    }
  }

  private async runCompensationFlow(): Promise<void> {
    for (const step of this.compensationSteps.reverse()) {
      await step.compensate()
    }
  }
}
