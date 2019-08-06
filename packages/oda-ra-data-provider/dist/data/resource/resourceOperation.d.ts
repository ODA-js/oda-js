import { FilterByFunction, IResource, IResourceOperation, IResourceOperationDefinition, OrderByFunction, ResponseFunction, ShouldFakeExecuteFunction, UpdateFunction, VariablesFunction, FetchPolicyFunction } from './interfaces';
import { queries } from './consts';
export default abstract class implements IResourceOperation {
    readonly query: any;
    readonly resultQuery: any;
    readonly parseResponse: ResponseFunction;
    readonly update: UpdateFunction;
    readonly variables: VariablesFunction;
    readonly resource: IResource;
    readonly type: queries;
    readonly fetchPolicy: string | FetchPolicyFunction;
    readonly orderBy: OrderByFunction;
    readonly filterBy: FilterByFunction;
    readonly reFetchQueries: any;
    readonly shouldFakeExecute: ShouldFakeExecuteFunction;
    protected _shouldFakeExecute: ShouldFakeExecuteFunction;
    protected _resource: IResource;
    protected _parseResponse: ResponseFunction;
    protected _update: UpdateFunction;
    protected _variables: VariablesFunction;
    protected _type: queries;
    protected _fetchPolicy: string | FetchPolicyFunction;
    protected _orderBy: OrderByFunction;
    protected _filterBy: FilterByFunction;
    protected _reFetchQueries: any;
    override({ parseResponse, update, variables, orderBy, filterBy, fetchPolicy, reFetchQueries, shouldFakeExecute, }: IResourceOperationDefinition): this;
    initDefaults({ shouldFakeExecute, update, }: IResourceOperationDefinition): void;
    constructor(options?: {
        overrides?: IResourceOperationDefinition;
        resource?: IResource;
    });
    connect(resource: IResource): this;
    private defaultUpdate;
    private defaultOrderBy;
}
//# sourceMappingURL=resourceOperation.d.ts.map