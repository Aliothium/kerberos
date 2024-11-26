import { z } from 'zod';

import { RequestResourceSchema } from '../schemas.js';

export const ResourceMockSchema = RequestResourceSchema.extend({ name: z.string().optional() });

export class ResourceMock {
  constructor(schema) {
    this.schema = RequestResourceSchema.parse(schema);
  }

  get id() {
    return this.schema.id;
  }

  get name() {
    return this.schema.name || this.schema.id;
  }

  get kind() {
    return this.schema.kind;
  }

  get attr() {
    return this.schema.attr;
  }
}
