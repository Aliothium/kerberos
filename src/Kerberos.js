import { z } from 'zod';

import { ResourcePolicy } from './ResourcePolicy/ResourcePolicy.js';
import { DerivedRoles } from './DerivedRoles/DerivedRoles.js';
import { RequestSchema, RequestPrincipalSchema, RequestResourceSchema, Effect } from './schemas.js';

const ResourcePolicyInstanceSchema = z.instanceof(ResourcePolicy);
const DerivedRolesInstanceSchema = z.instanceof(DerivedRoles);
const IsAllowedArgsSchema = z.object({
  principal: RequestPrincipalSchema,
  action: z.string(),
  resource: RequestResourceSchema,
});
const CheckResourcesArgsSchema = z.object({
  principal: RequestPrincipalSchema,
  resources: z
    .array(
      z.object({
        resource: RequestResourceSchema,
        actions: z.array(z.string()).nonempty(),
      }),
    )
    .nonempty(),
});
const CheckResourcesResponseSchema = z.object({
  results: z
    .array(
      z.object({
        resource: RequestResourceSchema.pick({ id: true, kind: true }),
        actions: z.record(z.string(), z.union([z.nativeEnum(Effect), z.boolean()])),
      }),
    )
    .nonempty(),
});

export class Kerberos {
  static parsePolicy(policy) {
    return policy instanceof ResourcePolicy ? ResourcePolicyInstanceSchema.parse(policy) : new ResourcePolicy(policy);
  }

  static parseDerivedRoles(roles) {
    return roles instanceof DerivedRoles ? DerivedRolesInstanceSchema.parse(roles) : new DerivedRoles(roles);
  }

  static parseRequest(principal, resource) {
    return RequestSchema.parse({ principal, resource, P: principal, R: resource });
  }

  constructor(policies, derivedRoles) {
    this.policies = this.getPoliciesMap(policies);
    this.derivedRoles = this.getDerivedRolesMap(derivedRoles);
  }

  getPoliciesMap(policies) {
    return new Map(
      policies.map((policy) => {
        const handledPolicy = Kerberos.parsePolicy(policy);
        return [handledPolicy.kind, handledPolicy];
      }),
    );
  }

  getDerivedRolesMap(roles) {
    return (
      new Map(
        roles?.map((role) => {
          const handledRole = Kerberos.parseDerivedRoles(role);
          return [handledRole.name, handledRole];
        }),
      ) ?? new Map()
    );
  }

  getImportedDerivedRoles(policy, req) {
    return policy.importDerivedRoles
      .map((name) => this.derivedRoles.get(name))
      .filter((v) => !!v)
      .reduce((acc, curr) => new Set([...acc, ...curr.get(req)]), new Set());
  }

  isAllowed(args) {
    const parsedArgs = IsAllowedArgsSchema.parse(args);
    const req = Kerberos.parseRequest(parsedArgs.principal, parsedArgs.resource);

    const policy = this.policies.get(req.R.kind);
    if (!policy) return false;

    return policy.isAllowed({ ...req, action: parsedArgs.action }, this.getImportedDerivedRoles(policy, req));
  }

  checkResources(args, effectAsBoolean) {
    const parsedArgs = CheckResourcesArgsSchema.parse(args);
    const results = parsedArgs.resources.map(({ resource, actions }) => {
      const req = Kerberos.parseRequest(parsedArgs.principal, resource);

      const policy = this.policies.get(req.R.kind);
      if (!policy) {
        return {
          resource,
          actions: Object.fromEntries(actions.map((action) => [action, !effectAsBoolean ? Effect.Deny : false])),
        };
      }

      const actionsResult = policy.check({ ...req, actions }, this.getImportedDerivedRoles(policy, req));

      return {
        resource,
        actions: Object.fromEntries([...actionsResult.entries()]),
      };
    });

    return CheckResourcesResponseSchema.transform((value) => {
      return {
        ...value,
        results: value.results.map((r) => ({
          ...r,
          actions: Object.fromEntries(
            Object.entries(r.actions).map(([action, effect]) => [action, !effectAsBoolean ? effect : effect === Effect.Allow]),
          ),
        })),
      };
    }).parse({ results });
  }
}
