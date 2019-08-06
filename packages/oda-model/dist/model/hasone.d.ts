import { EntityReference } from './entityreference';
import { HasOneInput, HasOneStorage } from './interfaces';
import { RelationBase } from './relationbase';
export declare class HasOne extends RelationBase {
    protected $obj: HasOneStorage;
    readonly hasOne: EntityReference;
    readonly ref: EntityReference;
    constructor(obj: HasOneInput);
    updateWith(obj: HasOneInput): void;
    toObject(): any;
    toJSON(): any;
}
//# sourceMappingURL=hasone.d.ts.map