import { IEntity, IField, IModel, IPackage, IRelation, IValidationResult } from '../interfaces';
import { IEntityContext, IFieldContext, IModelContext, IPackageContext, IRelationContext } from './interfaces';
export declare type RestartType = 'model' | 'package' | 'entity' | 'field' | 'relation';
export declare class RestartLevelError extends Error {
}
export declare class ModelLevel extends RestartLevelError {
}
export declare class PackageLevel extends RestartLevelError {
}
export declare class EntityLevel extends RestartLevelError {
}
export declare class FieldLevel extends RestartLevelError {
}
export declare class RelationLevel extends RestartLevelError {
}
export declare function restart(type: RestartType): void;
export declare class ModelContext implements IModelContext {
    model: IModel;
    errors: IValidationResult[];
    constructor(model: IModel);
    readonly isValid: boolean;
    restart(level: RestartType): void;
}
export declare class PackageContext implements IPackageContext {
    name: string;
    model: IModel;
    package: IPackage;
    errors: IValidationResult[];
    constructor(context: IModelContext, pkg: IPackage);
    readonly isValid: boolean;
    restart(level: RestartType): void;
}
export declare class EntityContext implements IEntityContext {
    entity: IEntity;
    model: IModel;
    package: IPackage;
    errors: IValidationResult[];
    constructor(context: IPackageContext, entity: IEntity);
    readonly isValid: boolean;
    restart(level: RestartType): void;
}
export declare class FieldContext implements IFieldContext {
    model: IModel;
    package: IPackage;
    entity: IEntity;
    field: IField;
    errors: IValidationResult[];
    constructor(context: IEntityContext, field: IField);
    readonly isValid: boolean;
    restart(level: RestartType): void;
}
export declare class RelationContext implements IRelationContext {
    model: IModel;
    package: IPackage;
    entity: IEntity;
    field: IField;
    relation: IRelation;
    errors: IValidationResult[];
    constructor(context: IFieldContext, relation: IRelation);
    readonly isValid: boolean;
    restart(level: RestartType): void;
}
//# sourceMappingURL=contexts.d.ts.map