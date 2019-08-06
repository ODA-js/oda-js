import { FieldArgs, MutationInput, MutationStorage } from './interfaces';
import { ModelBase } from './modelbase';
export declare class Mutation extends ModelBase {
    protected $obj: MutationStorage;
    readonly args: FieldArgs[];
    readonly payload: FieldArgs[];
    updateWith(obj: MutationInput): void;
    toObject(): any;
    toJSON(): MutationInput;
}
//# sourceMappingURL=mutation.d.ts.map