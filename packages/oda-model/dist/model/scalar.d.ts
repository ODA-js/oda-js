import { MetaModelType, ScalarInput } from './interfaces';
import { ModelBase } from './modelbase';
export declare class Scalar extends ModelBase {
    modelType: MetaModelType;
    constructor(obj: ScalarInput);
    updateWith(obj: ScalarInput): void;
}
//# sourceMappingURL=scalar.d.ts.map