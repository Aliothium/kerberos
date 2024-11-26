import { z } from 'zod';

import { RequestWithVariablesSchema } from '../Variables/schemas.js';

export const ConditionMatchExprSchema = z.function().args(RequestWithVariablesSchema).returns(z.boolean());

export const ConditionMatchSchema = z.union([
  ConditionMatchExprSchema,
  z.object({
    any: z.array(ConditionMatchExprSchema).nonempty(),
  }),
  z.object({
    all: z.array(ConditionMatchExprSchema).nonempty(),
  }),
]);

export const ConditionSchemaSchema = z.object({ match: ConditionMatchSchema }).strict();
