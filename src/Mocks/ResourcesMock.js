import { ResourceMock } from './ResourceMock.js';

export class ResourcesMock {
  static parse(resource) {
    return resource instanceof ResourceMock ? resource : new ResourceMock(resource);
  }

  constructor(resources) {
    this.resources = new Map(
      resources.map((R) => {
        const RR = ResourcesMock.parse(R);
        return [RR.name, RR];
      }),
    );
  }

  get mocks() {
    return [...this.resources.values()];
  }

  get(name) {
    return this.resources.get(name);
  }

  getById(id) {
    return [...this.resources.values()].find((r) => r.id === id);
  }
}
