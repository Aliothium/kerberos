import { PrincipalMock } from './PrincipalMock.js';

export class PrincipalsMock {
  static parse(principal) {
    return principal instanceof PrincipalMock ? principal : new PrincipalMock(principal);
  }

  constructor(principals) {
    this.principals = new Map(
      principals.map((P) => {
        const PP = PrincipalsMock.parse(P);
        return [PP.name, PP];
      })
    );
  }

  get mocks() {
    return [...this.principals.values()];
  }

  get(name) {
    return this.principals.get(name);
  }
}
