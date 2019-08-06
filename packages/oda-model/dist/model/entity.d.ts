import { EntityInput, EntityJSON, EntityStorage, IEntity, MetaModelType } from './interfaces';
import { ModelPackage } from './modelpackage';
import { EntityBase } from './entitybase';
export declare class Entity extends EntityBase implements IEntity {
    modelType: MetaModelType;
    protected $obj: EntityStorage;
    constructor(obj: EntityInput);
    readonly implements: Set<string>;
    readonly abstract: boolean;
    readonly embedded: boolean | string[];
    ensureImplementation(modelPackage: ModelPackage): void;
    updateWith(obj: EntityInput): void;
    toObject(modelPackage?: ModelPackage): any;
    toJSON(modelPackage?: ModelPackage): EntityJSON;
}
//# sourceMappingURL=entity.d.ts.map