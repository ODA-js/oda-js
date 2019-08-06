import { FieldArgs, FieldBaseInput, FieldBaseStorage, MetaModelType, FieldType } from './interfaces';
import { ModelBase } from './modelbase';
export declare class FieldBase extends ModelBase {
    modelType: MetaModelType;
    protected $obj: FieldBaseStorage;
    readonly entity: string;
    readonly type: FieldType;
    readonly inheritedFrom: string;
    readonly args: FieldArgs[];
    updateWith(obj: FieldBaseInput): void;
    toObject(): any;
    toJSON(): any;
}
//# sourceMappingURL=fieldbase.d.ts.map