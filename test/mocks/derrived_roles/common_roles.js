export const commonRolesPolicy = {
  name: 'common_roles',
  description: 'Common dynamic roles used within the Finance Demo app',
  definitions: [
    // If the principal belongs to group `USER` in a request, and the `resource`s
    // `ownerId` attribute matches `principal`s `id` then the `principal` is considered
    // as `OWNER` within Kerberos for the policy evaluation.
    {
      name: 'OWNER',
      parentRoles: ['USER'],
      condition: {
        match: ({ P, R }) => R.attr.ownerId === P.id,
      },
    },
    // If the principal belongs to group `USER` in a request, and the `principal`s
    // `department` attribute is "FINANCE",then the `principal` is considered
    // as `FINANCE` role within Kerberos for the policy evaluation.
    {
      name: 'FINANCE',
      parentRoles: ['USER'],
      condition: {
        match: ({ P }) => P.attr.department === 'FINANCE',
      },
    },
    // If the principal belongs to group `MANAGER` in a request, and the `principal`s
    // `department` attribute is "FINANCE",then the `principal` is considered
    // as `FINANCE_MANAGER` role within Kerberos for the policy evaluation.
    {
      name: 'FINANCE_MANAGER',
      parentRoles: ['MANAGER'],
      condition: {
        match: ({ P }) => P.attr.department === 'FINANCE',
      },
    },
    // If the principal belongs to group `MANAGER` in a request, and the `principal`s
    // `region` attribute matches `resource`s `region` attribute, then the `principal`
    // is considered as `REGION_MANAGER` role within Cerbos for the policy evaluation.
    {
      name: 'REGION_MANAGER',
      parentRoles: ['MANAGER'],
      condition: {
        match: ({ P, R }) => R.attr.region === P.attr.region,
      },
    },
  ],
};
