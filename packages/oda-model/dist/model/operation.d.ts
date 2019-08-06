import { MetaModelType, OperationStorage, OperationInput } from './interfaces';
import { FieldBase } from './fieldbase';
export declare class Operation extends FieldBase {
    modelType: MetaModelType;
    protected $obj: OperationStorage;
    readonly actionType: string;
    updateWith(obj: OperationInput): void;
    toObject(): any;
    toJSON(): any;
}
//# sourceMappingURL=operation.d.ts.map