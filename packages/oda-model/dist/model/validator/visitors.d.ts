import { IEntity, IField, IModel, IPackage, IRelation, IValidationResult } from '../interfaces';
import { IEntityContext, IFieldContext, IModelContext, IPackageContext } from './interfaces';
import { IVisitor, Validator } from './validator';
export declare class ModelVisitor {
    validator: Validator;
    visit(model: IModel): IValidationResult[];
    constructor(validator: Validator);
}
export declare class PackageVisitor implements IVisitor<IPackage, IModelContext> {
    validator: Validator;
    context: IModelContext;
    visit(item: IPackage): any[];
    constructor(validator: Validator, model?: IModelContext);
}
export declare class EntityVisitor implements IVisitor<IEntity, IPackageContext> {
    validator: Validator;
    context: IPackageContext;
    visit(item: IEntity): any[];
    constructor(validator: Validator, pkg: IPackageContext);
}
export declare class FieldVisitor implements IVisitor<IField, IEntityContext> {
    validator: Validator;
    context: IEntityContext;
    visit(item: IField): any[];
    constructor(validator: Validator, pkg: IEntityContext);
}
export declare class RelationVisitor implements IVisitor<IRelation, IFieldContext> {
    validator: Validator;
    context: IFieldContext;
    visit(item: IRelation): any[];
    constructor(validator: Validator, pkg: IFieldContext);
}
//# sourceMappingURL=visitors.d.ts.map