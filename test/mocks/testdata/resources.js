export const resourcesPolicy = {
  expense1: {
    id: 'expense1',
    kind: 'expense',
    attr: {
      ownerId: 'sally',
      createdAt: '2022-07-21T14:47:51.063Z',
      vendor: 'Flux Water Gear',
      region: 'EMEA',
      amount: 500,
      status: 'OPEN',
    },
  },
  expense2: {
    id: 'expense2',
    kind: 'expense',
    attr: {
      ownerId: 'sally',
      createdAt: '2022-09-21T12:47:51.063Z',
      vendor: 'Vortex Solar',
      region: 'EMEA',
      amount: 2500,
      status: 'APPROVED',
      approvedBy: 'frank',
    },
  },
  expense3: {
    id: 'expense3',
    kind: 'expense',
    attr: {
      ownerId: 'sally',
      createdAt: '2022-09-21T14:42:51.063Z',
      vendor: 'Global Airlines',
      region: 'EMEA',
      amount: 12000,
      status: 'OPEN',
    },
  },
  expense4: {
    id: 'expense4',
    kind: 'expense',
    attr: {
      ownerId: 'frank',
      createdAt: '2021-10-01T10:00:00.021-05:00',
      vendor: 'Vortex Solar',
      region: 'EMEA',
      amount: 2421,
      status: 'OPEN',
    },
  },
  expense5: {
    id: 'expense5',
    kind: 'expense',
    attr: {
      ownerId: 'sally',
      createdAt: '2022-09-21T12:47:51.063Z',
      vendor: 'Vortex Solar',
      region: 'EMEA',
      amount: 2500,
      status: 'REJECTED',
      approvedBy: 'frank',
    },
  },
};
