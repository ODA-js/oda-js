import { EntityReference } from './entityreference';
import { BelongsToInput, BelongsToStorage } from './interfaces';
import { RelationBase } from './relationbase';
export declare class BelongsTo extends RelationBase {
    protected $obj: BelongsToStorage;
    readonly belongsTo: EntityReference;
    readonly ref: EntityReference;
    constructor(obj: BelongsToInput);
    updateWith(obj: BelongsToInput): void;
    toObject(): any;
    toJSON(): any;
}
//# sourceMappingURL=belongsto.d.ts.map