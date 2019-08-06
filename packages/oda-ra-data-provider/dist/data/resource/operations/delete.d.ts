import ResourceOperation from '../resourceOperation';
import { IResourceOperationDefinition, IResource } from '../interfaces';
export default class extends ResourceOperation {
    readonly query: any;
    readonly resultQuery: any;
    constructor(options?: {
        overrides?: IResourceOperationDefinition;
        resource?: IResource;
    });
}
//# sourceMappingURL=delete.d.ts.map