import { IResourceOperationDefinition, IResource } from '../interfaces';
import ResourceOperation from '../resourceOperation';
export default class extends ResourceOperation {
    readonly query: any;
    readonly resultQuery: any;
    constructor(options?: {
        overrides?: IResourceOperationDefinition;
        resource?: IResource;
    });
}
//# sourceMappingURL=create.d.ts.map