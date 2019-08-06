import { ModelBaseInput, ModelBaseStorage } from './interfaces';
import { Metadata } from './metadata';
import { ModelPackage } from './modelpackage';
export declare class ModelBase extends Metadata {
    protected $obj: ModelBaseStorage;
    constructor(obj: ModelBaseInput);
    readonly name: string;
    readonly title: string;
    readonly description: string;
    toString(): string;
    toObject(modelPackage?: ModelPackage): any;
    toJSON(modelPackage?: ModelPackage): ModelBaseInput;
    updateWith(obj: ModelBaseInput): void;
    clone(): ModelBase;
}
//# sourceMappingURL=modelbase.d.ts.map