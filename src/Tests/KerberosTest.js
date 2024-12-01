import { z } from 'zod';

import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';

import { ResourceMock, ResourcesMock, PrincipalMock, PrincipalsMock } from './Mocks/index.js';
import { Effect } from '../schemas.js';
import { Kerberos } from '../Kerberos.js';

const KerberosTestInputSchema = z
  .object({
    principals: z.union([z.array(z.string()).nonempty(), z.instanceof(PrincipalsMock)]),
    resources: z.union([z.array(z.string()).nonempty(), z.instanceof(ResourcesMock)]),
    actions: z
      .array(z.string())
      .nonempty()
      .transform((actions) => new Set(actions)),
  })
  .strict();

const KerberosTestExpectedItemSchema = z
  .object({
    principal: z.union([z.string(), z.instanceof(PrincipalMock)]),
    resource: z.union([z.string(), z.instanceof(ResourceMock)]),
    actions: z.record(z.string(), z.union([z.nativeEnum(Effect), z.boolean()])),
  })
  .strict();

export const KerberosTestSchema = z
  .object({
    name: z.string(),
    input: KerberosTestInputSchema,
    expected: z.array(KerberosTestExpectedItemSchema).nonempty(),
  })
  .strict()
  .superRefine(({ input, expected }, ctx) => {
    const inputActions = input.actions;
    for (const item of expected) {
      const expectedActions = new Set(Object.keys(item.actions));
      for (const action of expectedActions) {
        if (!inputActions.has(action)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['expected', 'actions'],
            message: `Action "${action}" in expected is not present in input actions`,
          });
        }
      }
    }
  });

export class KerberosTest {
  constructor(schema, kerberos) {
    this.schema = KerberosTestSchema.parse(schema);
    if (kerberos && !(kerberos instanceof Kerberos)) throw new Error('Invalid Kerberos instance!');
    this.kerberos = kerberos;
    this.principals = this.schema.input.principals instanceof PrincipalsMock ? [this.schema.input.principals] : [];
    this.resources = this.schema.input.resources instanceof ResourcesMock ? [this.schema.input.resources] : [];
  }

  run({ kerberos, principals, resources }) {
    describe(this.schema.name, () => {
      if (kerberos && !(kerberos instanceof Kerberos)) throw new Error('Invalid Kerberos instance!');
      if (principals && principals?.some((p) => !(p instanceof PrincipalsMock))) {
        throw new Error('Invalid PrincipalsMock instance!');
      }
      if (resources && resources?.some((r) => !(r instanceof ResourcesMock))) {
        throw new Error('Invalid ResourcesMock instance!');
      }

      const kerberosInstance = this.kerberos || kerberos;
      if (!kerberosInstance) throw new Error('Kerberos instance is required!');

      const allPrincipalsMock = new PrincipalsMock([
        ...(principals?.flatMap((p) => p.mocks) || []),
        ...this.principals.flatMap((p) => p.mocks),
      ]);
      const allResourcesMock = new ResourcesMock([
        ...(resources?.flatMap((r) => r.mocks) || []),
        ...this.resources.flatMap((r) => r.mocks),
      ]);

      const principalsMap = new Map(allPrincipalsMock.mocks.map((p) => [p.name, p]));
      const resourcesMap = new Map(allResourcesMock.mocks.map((r) => [r.name, r]));

      for (const expectedItem of this.schema.expected) {
        const principalName =
          expectedItem.principal instanceof PrincipalMock ? expectedItem.principal.name : expectedItem.principal;
        const resourceName =
          expectedItem.resource instanceof ResourceMock ? expectedItem.resource.name : expectedItem.resource;

        const principal = principalsMap.get(principalName);
        const resource = resourcesMap.get(resourceName);

        if (!principal) {
          throw new Error(`Principal "${principalName}" not found!`);
        }
        if (!resource) {
          throw new Error(`Resource "${resourceName}" not found!`);
        }

        const actionsToTest = Object.keys(expectedItem.actions);

        it(`should match expected actions [principal: "${principal.name}"; resource: "${resource.name}"]`, () => {
          const { results } = kerberosInstance.checkResources(
            {
              principal,
              resources: [
                {
                  resource,
                  actions: actionsToTest,
                },
              ],
            },
            true
          );

          const result = results[0];
          const actions = result.actions;

          for (const [action, expectedEffect] of Object.entries(expectedItem.actions)) {
            const effect = actions[action];
            assert.ok(
              effect !== undefined,
              `Action "${action}" not found in the checked resources response!`
            );
            const expectedValue =
              typeof expectedEffect === 'boolean' ? expectedEffect : expectedEffect === Effect.Allow;
            assert.strictEqual(
              effect,
              expectedValue,
              `Action "${action}" effect is not matched! Expected: ${expectedValue} but got: ${effect}`
            );
          }
        });
      }
    });
  }
}
