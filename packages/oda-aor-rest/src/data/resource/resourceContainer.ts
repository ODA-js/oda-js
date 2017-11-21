import { IResourceContainer, IResourceBase, IResourceOverride } from './interfaces';
import { queries } from './consts';

export class ResourceContainer implements IResourceContainer {
  private resources: { [resource: string]: IResourceBase }
  constructor() {
    this.resources = {};
  }
  public register(name: string, resource: IResourceBase) {
    this.resources[name] = resource;
  }
  public override(name: string, resource: IResourceOverride) {
    let res = this.resources[name];
    res.override(resource);
  }
  public queries(resource: string, query: queries) {
    return this.resources[resource].query[query];
  }
}