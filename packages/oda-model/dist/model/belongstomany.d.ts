import { EntityReference } from './entityreference';
import { BelongsToManyInput, BelongsToManyStorage } from './interfaces';
import { RelationBase } from './relationbase';
export declare class BelongsToMany extends RelationBase {
    protected $obj: BelongsToManyStorage;
    readonly belongsToMany: EntityReference;
    readonly using: EntityReference;
    readonly ref: EntityReference;
    constructor(obj: BelongsToManyInput);
    updateWith(obj: BelongsToManyInput): void;
    toObject(): any;
    toJSON(): any;
}
//# sourceMappingURL=belongstomany.d.ts.map