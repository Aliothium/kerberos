import { z } from 'zod';

import { RequestPrincipalSchema } from '../../schemas.js';

export const PrincipalMockSchema = z.record(z.string(), RequestPrincipalSchema);

export class PrincipalMock {
  constructor(schema) {
    const schemaEntries = Object.entries(PrincipalMockSchema.parse(schema));
    const [name, parsedSchema] = schemaEntries[0];
    this.schema = parsedSchema;
    this.schema.name = name;
  }

  get id() {
    return this.schema.id;
  }

  get name() {
    return this.schema.name;
  }

  get roles() {
    return this.schema.roles;
  }

  get attr() {
    return this.schema.attr;
  }
}
