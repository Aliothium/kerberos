import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';

import { principalsPolicy } from './mocks/index.js';

import { PrincipalMock } from '../src/Tests/index.js';

describe('PrincipalMock', () => {
  it('should parse schema', () => {
    const principal = new PrincipalMock({ sally: principalsPolicy.sally });

    assert.strictEqual(principal.id, 'sally');
    assert.strictEqual(principal.name, 'sally');
    assert.deepEqual(principal.roles, ['USER']);
    assert.deepEqual(principal.attr, { department: 'SALES', region: 'EMEA' });
  });
});
