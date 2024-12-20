import { PrincipalsMock, ResourcesMock } from '../../src/Tests/index.js';
import { principalsPolicy } from './testdata/principals.js';
import { resourcesPolicy } from './testdata/resources.js';

export const expenseTestPolicy = {
  name: 'Expenses test suite',
  principals: new PrincipalsMock(principalsPolicy),
  resources: new ResourcesMock(resourcesPolicy),
  tests: [
    {
      name: 'Sales Roles',
      input: {
        principals: ['sally', 'sydney'],
        resources: ['expense1', 'expense2', 'expense3', 'expense4', 'expense5'],
        actions: ['view', 'view:approver', 'update', 'delete', 'approve'],
      },
      expected: [
        {
          principal: 'sally',
          resource: 'expense1',
          actions: {
            view: 'EFFECT_ALLOW',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_ALLOW',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'sally',
          resource: 'expense2',
          actions: {
            view: 'EFFECT_ALLOW',
            'view:approver': 'EFFECT_ALLOW',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'sally',
          resource: 'expense3',
          actions: {
            view: 'EFFECT_ALLOW',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_ALLOW',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'sally',
          resource: 'expense4',
          actions: {
            view: 'EFFECT_DENY',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'sally',
          resource: 'expense5',
          actions: {
            view: 'EFFECT_ALLOW',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'sydney',
          resource: 'expense1',
          actions: {
            view: 'EFFECT_DENY',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'sydney',
          resource: 'expense2',
          actions: {
            view: 'EFFECT_DENY',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'sydney',
          resource: 'expense3',
          actions: {
            view: 'EFFECT_DENY',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'sydney',
          resource: 'expense4',
          actions: {
            view: 'EFFECT_DENY',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'sydney',
          resource: 'expense5',
          actions: {
            view: 'EFFECT_DENY',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
      ]
    },
    {
      name: 'Sales Manager Role',
      input: {
        principals: ['mark', 'simon'],
        resources: ['expense1', 'expense2', 'expense3', 'expense4', 'expense5'],
        actions: ['view', 'view:approver', 'update', 'delete', 'approve'],
      },
      expected: [
        {
          principal: 'mark',
          resource: 'expense1',
          actions: {
            view: 'EFFECT_ALLOW',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'mark',
          resource: 'expense2',
          actions: {
            view: 'EFFECT_ALLOW',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'mark',
          resource: 'expense3',
          actions: {
            view: 'EFFECT_ALLOW',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'mark',
          resource: 'expense4',
          actions: {
            view: 'EFFECT_ALLOW',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'mark',
          resource: 'expense5',
          actions: {
            view: 'EFFECT_ALLOW',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'simon',
          resource: 'expense1',
          actions: {
            view: 'EFFECT_DENY',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'simon',
          resource: 'expense2',
          actions: {
            view: 'EFFECT_DENY',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'simon',
          resource: 'expense3',
          actions: {
            view: 'EFFECT_DENY',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'simon',
          resource: 'expense4',
          actions: {
            view: 'EFFECT_DENY',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'simon',
          resource: 'expense5',
          actions: {
            view: 'EFFECT_DENY',
            'view:approver': 'EFFECT_DENY',
            delete: 'EFFECT_DENY',
            update: 'EFFECT_DENY',
            approve: 'EFFECT_DENY',
          },
        },
      ],
    },
    {
      name: 'Finance Role approvals',
      input: {
        principals: ['frank', 'derek'],
        resources: ['expense1', 'expense2', 'expense3', 'expense4', 'expense5'],
        actions: ['approve'],
      },
      expected: [
        {
          principal: 'frank',
          resource: 'expense1',
          actions: {
            approve: 'EFFECT_ALLOW',
          },
        },
        {
          principal: 'frank',
          resource: 'expense2',
          actions: {
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'frank',
          resource: 'expense3',
          actions: {
            approve: 'EFFECT_DENY',
          },
          // outputs: [
          //   {
          //     action: 'approve',
          //     expected: [
          //       {
          //         src: 'resource.expense.vdefault#rule-008',
          //         val: {
          //           amount: 12000,
          //           message: 'Finance team members can only approve up to $10,000',
          //           principal: 'frank',
          //           resource: 'expense3',
          //         },
          //       },
          //     ],
          //   },
          // ],
        },
        {
          principal: 'frank',
          resource: 'expense4',
          actions: {
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'frank',
          resource: 'expense5',
          actions: {
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'derek',
          resource: 'expense1',
          actions: {
            approve: 'EFFECT_ALLOW',
          },
        },
        {
          principal: 'derek',
          resource: 'expense2',
          actions: {
            approve: 'EFFECT_DENY',
          },
        },
        {
          principal: 'derek',
          resource: 'expense3',
          actions: {
            approve: 'EFFECT_ALLOW',
          },
        },
        {
          principal: 'derek',
          resource: 'expense4',
          actions: {
            approve: 'EFFECT_ALLOW',
          },
        },
        {
          principal: 'derek',
          resource: 'expense5',
          actions: {
            approve: 'EFFECT_DENY',
          },
        },
      ],
    },
  ]
};
