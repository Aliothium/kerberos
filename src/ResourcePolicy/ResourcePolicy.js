import { ResourcePolicyRootSchemaSchema } from './schemas.js';

import { ALL_ACTIONS, Effect } from '../schemas.js';
import { Variables } from '../Variables/Variables.js';
import { Conditions } from '../Conditions/Conditions.js';

export class ResourcePolicy {
  apiVersion = 'v1';

  static parseVariables(variables) {
    return variables instanceof Variables ? variables : new Variables(variables);
  }

  static parseConditions(conditions) {
    if (!conditions) return undefined;
    return conditions instanceof Conditions ? conditions : new Conditions(conditions);
  }

  constructor(schema) {
    this.schema = ResourcePolicyRootSchemaSchema.parse(schema);
    if (this.schema.apiVersion !== this.apiVersion) throw new Error(`Unsupported API version: ${this.schema.apiVersion}`);
    if (this.schema.resourcePolicy.variables) {
      this.schema.resourcePolicy.variables = ResourcePolicy.parseVariables(this.schema.resourcePolicy.variables);
    }
    this.schema.resourcePolicy.rules = this.schema.resourcePolicy.rules.map((rule) => ({
      ...rule,
      condition: ResourcePolicy.parseConditions(rule.condition),
    }));
  }

  get kind() {
    return this.schema.resourcePolicy.resource;
  }

  get importDerivedRoles() {
    return this.schema.resourcePolicy.importDerivedRoles ?? [];
  }

  get rules() {
    return this.schema.resourcePolicy.rules;
  }

  populateVariables(req) {
    const variables = this.schema.resourcePolicy.variables?.get(req);
    return { ...req, variables, V: variables };
  }

  buildEffects(req, derivedRoles) {
    const result = new Map();

    for (const rule of this.rules) {
      if (!rule.actions.includes(ALL_ACTIONS) && !rule.actions.some((action) => req.actions.includes(action))) continue;
      if (!rule.roles?.some((role) => req.P.roles.includes(role)) && !rule.derivedRoles?.some((role) => derivedRoles.has(role))) {
        for (const action of rule.actions) result.set(action, Effect.Deny);
        continue;
      }

      if (rule.condition && !rule.condition.isFulfilled(req)) {
        for (const action of rule.actions) result.set(action, rule.effect === Effect.Allow ? Effect.Deny : Effect.Allow);
        continue;
      }

      for (const action of rule.actions) result.set(action, rule.effect);
    }

    return result;
  }

  isAllowed(req, derivedRoles) {
    // for (const rule of this.rules) {
    //   if (!rule.actions.includes(ALL_ACTIONS) && !rule.actions.includes(req.action)) continue;
    // eslint-disable-next-line max-len
    //   if (!rule.roles?.some((role) => req.P.roles.includes(role)) && !rule.derivedRoles?.some((role) => derivedRoles.has(role))) {
    //     continue;
    //   }
    //
    //   if (!rule.condition) return rule.effect === Effect.Allow;
    //   if (!rule.condition.isFulfilled(req)) continue;
    //   return rule.effect === Effect.Allow;
    // }
    //
    // return false;

    const effects = this.buildEffects(this.populateVariables({ ...req, actions: [req.action] }), derivedRoles);
    return effects.get(req.action) === Effect.Allow || effects.get(ALL_ACTIONS) === Effect.Allow;
  }

  // returns map of actions and effects
  check(req, derivedRoles) {
    return this.buildEffects(this.populateVariables(req), derivedRoles);
  }
}
