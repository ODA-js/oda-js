import { IResourceOperationDefinition, IResource } from '../interfaces';
import ResourceOperation from '../resourceOperation';
export default class extends ResourceOperation {
    readonly query: (params: {
        target: string;
    }) => any;
    readonly resultQuery: (params: {
        target: string;
    }) => any;
    constructor(options?: {
        overrides?: IResourceOperationDefinition;
        resource?: IResource;
    });
}
//# sourceMappingURL=getManyReference.d.ts.map