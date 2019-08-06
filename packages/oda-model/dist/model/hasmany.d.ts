import { EntityReference } from './entityreference';
import { HasManyInput, HasManyStorage } from './interfaces';
import { RelationBase } from './relationbase';
export declare class HasMany extends RelationBase {
    protected $obj: HasManyStorage;
    readonly hasMany: EntityReference;
    readonly ref: EntityReference;
    constructor(obj: HasManyInput);
    updateWith(obj: HasManyInput): void;
    toObject(): any;
    toJSON(): any;
}
//# sourceMappingURL=hasmany.d.ts.map