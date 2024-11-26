import { z } from 'zod';
import { RequestSchema } from '../schemas.js';

export const VariablesReturnTypeSchema = z.union([z.boolean(), z.string(), z.number(), z.null()]);

export const VariablesSchemaSchema = z.record(z.string(), z.function().args(RequestSchema).returns(VariablesReturnTypeSchema));

export const RequestWithVariablesSchema = RequestSchema.extend({
  variables: z.record(z.string(), VariablesReturnTypeSchema).optional(),
  V: z.record(z.string(), VariablesReturnTypeSchema).optional(),
});
