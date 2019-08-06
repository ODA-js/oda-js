import { FieldArgs, QueryInput, QueryStorage } from './interfaces';
import { ModelBase } from './modelbase';
export declare class Query extends ModelBase {
    protected $obj: QueryStorage;
    readonly args: FieldArgs[];
    readonly payload: FieldArgs[];
    updateWith(obj: QueryInput): void;
    toObject(): any;
    toJSON(): any;
}
//# sourceMappingURL=query.d.ts.map