import { IResourceContainer, IResource, IResourceDefinition, IResourceOperation } from './interfaces';
import { queries } from './consts';
import Resource from './resource';
export { queries }

export class ResourceContainer implements IResourceContainer {
  private resources: { [resource: string]: IResource }
  constructor(options?: IResourceDefinition[] | IResourceDefinition) {
    this.resources = {};
    if (Array.isArray(options)) {
      options.forEach(this.register.bind(this));
    } else if (options) {
      this.register(options);
    }
  }
  public register(resource: IResourceDefinition) {
    this.resources[resource.name] = new Resource(resource);
  }
  public override(resource: IResourceDefinition) {
    let res = this.resources[resource.name];
    res.override(resource);
  }
  public queries(resource: string, query: queries) {
    return this.resources[resource].query[query];
  }
}