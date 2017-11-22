import { IResourceContainer, IResource, IResourceDefinition, IResourceOperation } from './interfaces';
import { queries } from './consts';
import Resource from './resource';
export { queries }

export default class implements IResourceContainer {
  private resources: { [resource: string]: IResource }
  constructor(options?: IResourceDefinition[] | IResourceDefinition) {
    this.resources = {};
    if (Array.isArray(options)) {
      options.forEach(this.register.bind(this));
    } else if (options) {
      this.register(options);
    }
  }
  public register(resource: IResourceDefinition[] | IResourceDefinition) {
    if (Array.isArray(resource)) {
      resource.forEach(this.register.bind(this));
    } else if (resource) {
      this.resources[resource.name] = (resource instanceof Resource) ? resource.connect(this) : new Resource(resource, this);
    }
  }
  public override(resource: IResourceDefinition[] | IResourceDefinition) {
    if (Array.isArray(resource)) {
      resource.forEach(this.override.bind(this));
    } else if (resource) {
      let res = this.resources[resource.name];
      res.override(resource);
    }
  }
  public queries(resource: string, query: queries) {
    return this.resources[resource].query[query];
  }
}