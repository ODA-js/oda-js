import { MetaModelType, UnionStorage, UnionInput } from './interfaces';
import { ModelBase } from './modelbase';
export declare class Union extends ModelBase {
    modelType: MetaModelType;
    protected $obj: UnionStorage;
    readonly items: string[];
    updateWith(obj: UnionInput): void;
    toObject(): any;
    toJSON(): any;
}
//# sourceMappingURL=union.d.ts.map