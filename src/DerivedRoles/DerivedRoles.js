import { DerivedRolesSchemaSchema } from './schemas.js';

import { Variables } from '../Variables/Variables.js';
import { Conditions } from '../Conditions/Conditions.js';

export class DerivedRoles {
  apiVersion = 'v1';

  static parseVariables(variables) {
    return variables instanceof Variables ? variables : new Variables(variables);
  }

  static parseConditions(conditions) {
    return conditions instanceof Conditions ? conditions : new Conditions(conditions);
  }

  constructor(schema) {
    this.schema = DerivedRolesSchemaSchema.parse(schema);
    if (this.schema.apiVersion !== this.apiVersion) throw new Error(`Unsupported API version: ${this.schema.apiVersion}`);
    if (this.schema.variables) this.schema.variables = DerivedRoles.parseVariables(this.schema.variables);
    this.schema.definitions = this.schema.definitions.map((def) => ({
      ...def,
      condition: DerivedRoles.parseConditions(def.condition),
    }));
  }

  get name() {
    return this.schema.name;
  }

  get roles() {
    return new Map(this.schema.definitions.map((def) => [def.name, def]));
  }

  get(req) {
    const roles = new Set();

    for (const [name, def] of this.roles) {
      if (this.isRoleMatched(def, this.populateVariables(req))) roles.add(name);
    }

    return roles;
  }

  populateVariables(req) {
    const variables = this.schema.variables?.get(req);
    return { ...req, variables, V: variables };
  }

  isRoleMatched(def, req) {
    if (!def.parentRoles.some((role) => req.P.roles.includes(role))) return false;
    return def.condition.isFulfilled(req);
  }
}
