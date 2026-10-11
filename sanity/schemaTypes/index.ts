import { type SchemaTypeDefinition } from 'sanity'
import { projectType } from './project-type'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType],
}

