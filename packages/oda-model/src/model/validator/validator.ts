import { ModelVisitor, PackageVisitor, EntityVisitor, RelationVisitor, FieldVisitor } from './visitors';
import {
  IModel,
  IModelType,
  IPackage,
  isEntity,
  isField,
  isModel,
  isPackage,
  isRelation,
  IValidate,
  IValidationResult,
  IValidator,
  MetaModelType,
  IEntity,
  IEntityRef,
  IField,
  IRelation,
} from '../interfaces';
import { ModelContext, PackageContext, EntityContext, FieldContext, RelationContext } from './contexts';
import { IModelContext, ValidationContext, IPackageContext, IEntityContext, IFieldContext } from './interfaces';
import { Rule } from './rules';

export class Validator implements IValidator {
  public errors: IValidationResult[];
  public rules: { [modelType: string]: object[]; };
  public constructor() {
    this.errors = [];
    this.rules = {};
  }

  public registerRule<T extends ValidationContext>(modelType: MetaModelType, rule: Rule<T>[]) {
    if (!this.rules[modelType]) {
      this.rules[modelType] = [];
    }
    this.rules[modelType].push(...rule);
  }

  public getRules<T extends ValidationContext>(modelType: MetaModelType): Rule<T>[] {
    return <Rule<T>[]>this.rules[modelType] || [];
  }

  public check(item, options?: {
    model?: IModelContext,
    package?: IPackageContext,
    entity?: IEntityContext,
    field?: IFieldContext,
  }): IValidationResult[] {
    let walker;
    if (isModel(item)) {
      return (new ModelVisitor(this)).visit(item);
    }
    if (isPackage(item)) {
      return (new PackageVisitor(this)).visit(item);
    }
    if (isEntity(item) && options && options.package) {
      return (new EntityVisitor(this, options.package)).visit(item);
    }
    if (isField(item) && options && options.entity) {
      return (new FieldVisitor(this, options.entity)).visit(item);
    }
    if (isRelation(item) && options && options.field) {
      return (new RelationVisitor(this, options.field)).visit(item);
    }
    return [];
  }
}

export interface IVisitor<T extends IModelType, C extends ValidationContext> {
  context: C;
  visit(item: T);
}
