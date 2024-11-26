import { z } from 'zod';

import { RequestPrincipalSchema } from '../schemas.js';

export const PrincipalMockSchema = RequestPrincipalSchema.extend({ name: z.string().optional() });

export class PrincipalMock {
  constructor(schema) {
    this.schema = PrincipalMockSchema.parse(schema);
  }

  get id() {
    return this.schema.id;
  }

  get name() {
    return this.schema.name || this.schema.id;
  }

  get roles() {
    return this.schema.roles;
  }

  get attr() {
    return this.schema.attr;
  }
}
