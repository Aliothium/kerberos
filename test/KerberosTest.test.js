import { describe } from 'node:test';

import { principalsPolicy, expenseTestPolicy, resourcesPolicy, expensePolicy, commonRolesPolicy } from './mocks/index.js';

import { KerberosTest, PrincipalsMock, ResourcesMock } from '../src/Tests/index.js';
import { Kerberos } from '../src/index.js';

describe('KerberosTest', () => {
  describe('(Kerberos instance injected via constructor)', () => {
    const kerberosTest = new KerberosTest(expenseTestPolicy.tests[0], new Kerberos([expensePolicy], [commonRolesPolicy], { logger: true }));
    kerberosTest.run({
      principals: [new PrincipalsMock(principalsPolicy)],
      resources: [new ResourcesMock(resourcesPolicy)],
    });
  });
});
