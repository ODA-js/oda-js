import { MetaModelType, EnumStorage, EnumItemInput, EnumInput } from './interfaces';
import { ModelBase } from './modelbase';
export declare class Enum extends ModelBase {
    modelType: MetaModelType;
    protected $obj: EnumStorage;
    readonly items: EnumItemInput[];
    updateWith(obj: EnumInput): void;
    toObject(): any;
    toJSON(): any;
}
//# sourceMappingURL=enum.d.ts.map