import { FieldArgs, DirectiveInput, DirectiveStorage, MetaModelType } from './interfaces';
import { ModelBase } from './modelbase';
export declare class Directive extends ModelBase {
    modelType: MetaModelType;
    protected $obj: DirectiveStorage;
    readonly args: FieldArgs[];
    readonly on: string[];
    updateWith(obj: DirectiveInput): void;
    toObject(): any;
    toJSON(): any;
}
//# sourceMappingURL=directive.d.ts.map