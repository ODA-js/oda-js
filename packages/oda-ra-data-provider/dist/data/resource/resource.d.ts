import { FragmentsDefinitions, IResourceOperationsDefinition, IResourceQueryDefinitions } from './interfaces';
import { FieldsDefinition, IResource, IResourceContainer, IResourceDefinition } from './interfaces';
export default class implements IResource {
    readonly fragments: (frg: {
        [key: string]: FragmentsDefinitions;
    }) => FragmentsDefinitions;
    readonly queries: IResourceQueryDefinitions;
    readonly fields: FieldsDefinition;
    readonly name: string;
    readonly operations: IResourceOperationsDefinition;
    readonly resourceContainer: IResourceContainer;
    protected _fragments: (frg: {
        [key: string]: FragmentsDefinitions;
    }) => FragmentsDefinitions;
    protected _queries: IResourceQueryDefinitions;
    protected _fields: FieldsDefinition;
    protected _name: string;
    private _resourceContainer;
    private _operations;
    override(overrides: IResourceDefinition): this;
    constructor(options?: {
        overrides?: IResourceDefinition;
        resourceContainer?: IResourceContainer;
    });
    connect(resourceContainer: IResourceContainer): this;
}
//# sourceMappingURL=resource.d.ts.map