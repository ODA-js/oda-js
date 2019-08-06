import { EntityReferenceInput, IEntityRef, MetaModelType } from './interfaces';
export declare class EntityReference implements IEntityRef {
    modelType: MetaModelType;
    protected $obj: {
        backField_: string;
        entity_: string;
        field_: string;
        backField: string;
        entity: string;
        field: string;
    };
    entity: string;
    field: string;
    backField: string;
    constructor(entity: string | EntityReferenceInput, field?: string, backField?: string);
    clone(): EntityReference;
    toObject(): any;
    toJSON(): any;
    updateWith(obj: EntityReferenceInput): void;
    toString(): string;
}
//# sourceMappingURL=entityreference.d.ts.map