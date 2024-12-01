import { describe } from 'node:test';

import { expenseTestPolicy, expensePolicy, commonRolesPolicy } from './mocks/index.js';

import { KerberosTests } from '../src/Tests/index.js';
import { Kerberos } from '../src/index.js';

describe('KerberosTests', () => {
  describe('Expense Policy (raw mode)', () => {
    const kerberos = new Kerberos([expensePolicy], [commonRolesPolicy], { logger: true });
    const tests = new KerberosTests(kerberos, [expenseTestPolicy]);

    tests.run();
  });
});
