import { queries } from './consts';
import { IResource, IResourceContainer, IResourceDefinition } from './interfaces';
export default class implements IResourceContainer {
    fragments: {
        [fragments: string]: IResource;
    };
    private resources;
    constructor(options?: IResourceDefinition[] | IResourceDefinition);
    register(resource: IResourceDefinition[] | IResourceDefinition): void;
    override(resource: IResourceDefinition[] | IResourceDefinition): void;
    queries(resource: string, query: queries): import("./interfaces").IResourceOperation;
    resource(resource: string): IResource;
}
//# sourceMappingURL=resourceContainer.d.ts.map