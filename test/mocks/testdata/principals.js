export const principalsPolicy = {
  sally: {
    id: 'sally',
    roles: ['USER'],
    attr: {
      department: 'SALES',
      region: 'EMEA',
    },
  },
  ian: {
    id: 'ian',
    roles: ['ADMIN'],
    attr: {
      department: 'IT',
    },
  },
  frank: {
    id: 'frank',
    roles: ['USER'],
    attr: {
      department: 'FINANCE',
      region: 'EMEA',
    },
  },
  derek: {
    id: 'derek',
    roles: ['USER', 'MANAGER'],
    attr: {
      department: 'FINANCE',
      region: 'EMEA',
    },
  },
  simon: {
    id: 'simon',
    roles: ['USER', 'MANAGER'],
    attr: {
      department: 'SALES',
      region: 'NA',
    },
  },
  mark: {
    id: 'mark',
    roles: ['USER', 'MANAGER'],
    attr: {
      department: 'SALES',
      region: 'EMEA',
    },
  },
  sydney: {
    id: 'sydney',
    roles: ['USER'],
    attr: {
      department: 'SALES',
      region: 'NA',
    },
  },
};
