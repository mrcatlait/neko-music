import { containsBySelector } from './contains-by-selector.command'
import { findBySelector } from './find-by-selector.command'
import { getBySelector } from './get-by-selector.command'

Cypress.Commands.addAll({
  containsBySelector,
  getBySelector,
})

Cypress.Commands.addAll(
  { prevSubject: true },
  {
    findBySelector,
  },
)
