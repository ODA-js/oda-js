import { Rule } from '../rule';
import { IValidator } from '../interfaces/IValidator';
import { IValidationResult } from '../interfaces/IValidationResult';
import { ValidationContext, MetaModelType } from '../interfaces/types';
import { IModelContext } from '../contexts/IModelContext';
import { IPackageContext } from '../contexts/IPackageContext';
import { IEntityContext } from '../contexts/IEntityContext';
import { IFieldContext } from '../contexts/IFieldContext';
import { isPackage, isEntity, isField, isRelation, isModel } from '../helpers';
import { IModelType } from '../interfaces/IModelType';
import { ModelVisitor } from '../visitors/ModelVisitor';
import { PackageVisitor } from '../visitors/PackageVisitor';
import { EntityVisitor } from '../visitors/EntityVisitor';
import { FieldVisitor } from '../visitors/FieldVisitor';
import { RelationVisitor } from '../visitors/RelationVisitor';
import { IValidationContext } from '../contexts/IValidationContext';

export class FullValidator implements IValidator {
  public errors: IValidationResult[];
  public rules: { [modelType: string]: object[] };
  public constructor() {
    this.errors = [];
    this.rules = {};
  }

  public registerRule<T extends ValidationContext>(
    modelType: MetaModelType,
    rule: Rule<T>[],
  ) {
    if (!this.rules[modelType]) {
      this.rules[modelType] = [];
    }
    this.rules[modelType].push(...rule);
  }

  public getRules<T extends ValidationContext>(
    modelType: MetaModelType,
  ): Rule<T>[] {
    return <Rule<T>[]>this.rules[modelType] || [];
  }

  public check(
    item,
    options?: {
      model?: IModelContext & IValidationContext;
      package?: IPackageContext & IValidationContext;
      entity?: IEntityContext & IValidationContext;
      field?: IFieldContext & IValidationContext;
    },
  ): IValidationResult[] {
    let walker;
    if (isModel(item)) {
      return new ModelVisitor(this).visit(item);
    }
    if (isPackage(item)) {
      return new PackageVisitor(this).visit(item);
    }
    if (isEntity(item) && options && options.package) {
      return new EntityVisitor(this, options.package).visit(item);
    }
    if (isField(item) && options && options.entity) {
      return new FieldVisitor(this, options.entity).visit(item);
    }
    if (isRelation(item) && options && options.field) {
      return new RelationVisitor(this, options.field).visit(item);
    }
    return [];
  }
}
