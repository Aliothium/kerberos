import { z } from 'zod';

import { VariablesSchemaSchema } from '../Variables/schemas.js';
import { VariablesInstanceSchema } from '../Variables/Variables.js';
import { ConditionSchemaSchema } from '../Conditions/schemas.js';
import { ConditionsInstanceSchema } from '../Conditions/Conditions.js';

export const DerivedRolesDefinitionSchemaSchema = z
  .object({
    name: z.string(),
    parentRoles: z.array(z.string()).nonempty(),
    condition: z.union([ConditionSchemaSchema, ConditionsInstanceSchema]),
  })
  .strict();

export const DerivedRolesSchemaSchema = z
  .object({
    apiVersion: z.string(),
    name: z.string(),
    variables: z.union([VariablesSchemaSchema, VariablesInstanceSchema]).optional(),
    definitions: z.array(DerivedRolesDefinitionSchemaSchema).nonempty(),
  })
  .strict();
