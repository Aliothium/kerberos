import { z } from 'zod';

export const RequestPrincipalSchema = z.object({
  id: z.string(),
  roles: z.array(z.string()).nonempty(),
  attr: z.record(z.string(), z.any()),
});

export const RequestResourceSchema = z.object({
  id: z.string(),
  kind: z.string(),
  attr: z.record(z.string(), z.any()),
});

export const RequestSchema = z
  .object({
    principal: RequestPrincipalSchema,
    resource: RequestResourceSchema,
    P: RequestPrincipalSchema,
    R: RequestResourceSchema,
  });

export const ALL_ACTIONS = '*';

export const Effect = {
  Allow: 'Allow',
  Deny: 'Deny',
};
