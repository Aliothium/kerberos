import { z } from 'zod';

import { ConditionSchemaSchema } from './schemas.js';

export const matchStrategy = {
  any: (conds, req) => conds.some((cond) => cond(req)),
  all: (conds, req) => conds.every((cond) => cond(req)),
};

export class Conditions {
  static strategies = {
    match: {
      any: (conds, req) => conds.some((cond) => cond(req)),
      all: (conds, req) => conds.every((cond) => cond(req)),
    },
  };

  constructor(schema) {
    this.schema = ConditionSchemaSchema.parse(schema);
  }

  isFulfilled(req) {
    const [strategyKey] = Object.keys(this.schema);
    if (typeof this.schema[strategyKey] === 'function') {
      return this.schema[strategyKey](req);
    }
    const [subStrategyKey] = Object.keys(this.schema[strategyKey]);
    return Conditions.strategies[strategyKey][subStrategyKey](this.schema[strategyKey][subStrategyKey], req);
  }
}

export const ConditionsInstanceSchema = z.instanceof(Conditions);
