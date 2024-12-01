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
  .strict();
// .superRefine(({ input, expected }, ctx) => {
//   const invalidAction = expected.find((item) => input.actions?.size !== Object.keys(item.actions).length);
//
//   if (invalidAction) {
//     const expectedActionsNames = Object.keys(invalidAction.actions);
//     const expectedActions = new Set(expectedActionsNames);
//     const invalidActionName =
//       expectedActions.size > input.actions?.size
//         ? expectedActionsNames.find((action) => !input.actions?.has(action))
//         : Array.from(input.actions).find((action) => !expectedActions.has(action));
//     if (invalidActionName) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ['expected', 'input'],
//         message: `Action "${invalidActionName}" is missing in the input actions or in the expected actions`,
//       });
//     }
//   }
// });

export class KerberosTest {
  constructor(schema, kerberos) {
    KerberosTestSchema.parse(schema);
    if (kerberos && !(kerberos instanceof Kerberos)) throw new Error('Invalid Kerberos instance!');
    this.schema = schema;
    this.kerberos = kerberos;
    this.principals = this.schema.input.principals instanceof PrincipalsMock ? [this.schema.input.principals] : [];
    this.resources = this.schema.input.resources instanceof ResourcesMock ? [this.schema.input.resources] : [];
  }

  run({
    kerberos,
    principals,
    resources,
  }) {
    describe(this.schema.name, () => {
      if (kerberos && !(kerberos instanceof Kerberos)) throw new Error('Invalid Kerberos instance!');
      if (principals && principals?.some((p) => !(p instanceof PrincipalsMock))) { throw new Error('Invalid PrincipalsMock instance!'); }
      if (resources && resources?.some((r) => !(r instanceof ResourcesMock))) throw new Error('Invalid ResourcesMock instance!');

      const kerberosInstance = this.kerberos || kerberos;
      if (!kerberosInstance) throw new Error('Kerberos instance is required!');

      const allImportedPrincipalsMock = new PrincipalsMock([
        ...(principals?.flatMap((p) => p.mocks) || []),
        ...this.principals.flatMap((p) => p.mocks),
      ]);
      const allImportedResourcesMock = new ResourcesMock([
        ...(resources?.flatMap((r) => r.mocks) || []),
        ...this.resources.flatMap((r) => r.mocks),
      ]);
      const allInputPrincipals =
        this.schema.input.principals instanceof PrincipalsMock
          ? allImportedPrincipalsMock
          : new PrincipalsMock([
            ...allImportedPrincipalsMock.mocks,
            ...this.schema.input.principals.map((p) => allImportedPrincipalsMock.get(p)).filter((p) => !!p),
          ]);
      const allInputResources =
        this.schema.input.resources instanceof ResourcesMock
          ? allImportedResourcesMock
          : new ResourcesMock([
            ...allImportedResourcesMock.mocks,
            ...this.schema.input.resources.map((r) => allImportedResourcesMock.get(r)).filter((r) => !!r),
          ]);

      const expectedActionByKey = new Map(
        this.schema.expected.map((item) => {
          const principal = item.principal instanceof PrincipalMock ? item.principal : allInputPrincipals.get(item.principal);
          const resource = item.resource instanceof ResourceMock ? item.resource : allInputResources.get(item.resource);
          if (!principal) {
            throw new Error(
              `Principal "${item.principal instanceof PrincipalMock ? item.principal.name : item.principal}" not found!`
            );
          }
          if (!resource) {
            throw new Error(
              `Resource "${item.resource instanceof ResourceMock ? item.resource.name : item.resource}" not found!`
            );
          }

          return [
            `${principal.name}:${resource.name}`,
            Object.fromEntries(
              Object.entries(item.actions).map(([action, effect]) => [
                action,
                typeof effect === 'boolean' ? effect : effect === Effect.Allow,
              ])
            ),
          ];
        })
      );

      for (const principal of allInputPrincipals.mocks) {
        const { results } = kerberosInstance.checkResources(
          {
            principal,
            resources: allInputResources.mocks.map((resource) => ({
              resource,
              actions: [...this.schema.input.actions],
            })),
          },
          true
        );
        for (const result of results) {
          const actions = new Map(Object.entries(result.actions));
          const resource = allInputResources.getById(result.resource.id);
          if (!resource) throw new Error(`Resource "${result.resource.id}" not found!`);
          it(`should matched with expected actions [principal: "${principal.name}"; resource: "${resource.name}"]`, () => {
            const expectedActions = expectedActionByKey.get(`${principal.name}:${resource.name}`);
            assert.ok(
              expectedActions,
              `Expected actions not found for [principal: "${principal.name}"; resource: "${resource.name}"]`
            );
            for (const [action, expectedEffect] of Object.entries(expectedActions)) {
              const effect = actions.get(action);
              assert.ok(effect !== undefined, `Action "${action}" not found in the checked resources response!`);
              assert.strictEqual(
                effect,
                expectedEffect,
                `Action "${action}" effect is not matched! Expected: ${expectedEffect} but got: ${effect}`,
              );
            }
          });
        }
      }
    });
  }
}
