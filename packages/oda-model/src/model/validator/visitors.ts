import { IEntity, IField, IModel, IPackage, IRelation, IValidationResult, ValidationResultType } from '../interfaces';
import { EntityContext, FieldContext, ModelContext, PackageContext, RelationContext } from './contexts';
import { IVisitor, Validator } from './validator';
import { IEntityContext, IFieldContext, IModelContext, IPackageContext } from './interfaces';

export class ModelVisitor {
  public validator: Validator;
  public visit(model: IModel): IValidationResult[] {
    const context = new ModelContext(model);
    const result: IValidationResult[] = [];
    if (context.isValid) {
      const rules = this.validator.getRules('model');
      rules.forEach(rule => result.push(...rule.validate(context)));
      Array.from(model.packages.values()).filter(p => p.name !== model.name).forEach(p => {
        result.push(...this.validator.check(p, { model: context }));
      });
    } else {
      result.push({
        model: context.model.name,
        message: 'Validation context invalid',
        result: ValidationResultType.error,
      });
    }
    return result.map(r => ({
      ...r,
      model: context.model.name,
    }));
  }
  constructor(validator: Validator) {
    this.validator = validator;
  }
}

export class PackageVisitor implements IVisitor<IPackage, IModelContext> {
  public validator: Validator;
  public context: IModelContext; // has to be parent context
  public visit(item: IPackage) {
    if (!this.context) {
      this.context = new ModelContext(item.metaModel);
    }
    const context = new PackageContext(this.context, item);
    const result = [];
    if (context.isValid) {
      const rules = this.validator.getRules('package');
      rules.forEach(rule => result.push(...rule.validate(context)));
      item.entities.forEach(p => {
        result.push(... this.validator.check(p, { package: context }));
      });
    } else {
      result.push({
        package: context.package.name,
        message: 'Validation context invalid',
        result: ValidationResultType.error,
      });
    }
    return result.map(r => ({
      ...r,
      package: context.package.name,
    }));
  }

  constructor(validator: Validator, model?: IModelContext) {
    this.validator = validator;
    this.context = model;
  }
}

export class EntityVisitor implements IVisitor<IEntity, IPackageContext> {
  public validator: Validator;
  public context: IPackageContext; // has to be parent context
  public visit(item: IEntity) {
    const context = new EntityContext(this.context, item);
    const result = [];
    if (context.isValid) {
      const rules = this.validator.getRules('entity');
      rules.forEach(rule => result.push(...rule.validate(context)));
      item.fields.forEach(p => {
        result.push(...this.validator.check(p, { entity: context }));
      });
    } else {
      result.push({
        entity: context.entity.name,
        message: 'Validation context invalid',
        result: ValidationResultType.error,
      });
    }
    return result.map(r => ({
      ...r,
      entity: context.entity.name,
    }));
  }

  constructor(validator: Validator, pkg: IPackageContext) {
    this.validator = validator;
    this.context = pkg;
  }
}

export class FieldVisitor implements IVisitor<IField, IEntityContext> {
  public validator: Validator;
  public context: IEntityContext; // has to be parent context
  public visit(item: IField) {
    const context = new FieldContext(this.context, item);
    const result = [];
    if (context.isValid) {
      const rules = this.validator.getRules('field');
      rules.forEach(rule => result.push(...rule.validate(context)));
      if (item.relation) {
        result.push(...this.validator.check(item.relation, { field: context }));
      }
    } else {
      result.push({
        message: 'Validation context invalid',
        result: ValidationResultType.error,
      });
    }
    return result.map(r => ({
      ...r,
      field: context.field.name,
    }));
  }

  constructor(validator: Validator, pkg: IEntityContext) {
    this.validator = validator;
    this.context = pkg;
  }
}

export class RelationVisitor implements IVisitor<IRelation, IFieldContext> {
  public validator: Validator;
  public context: IFieldContext; // has to be parent context
  public visit(item: IRelation) {
    const context = new RelationContext(this.context, item);
    const result = [];
    if (context.isValid) {
      const rules = this.validator.getRules('relation');
      rules.forEach(rule => result.push(...rule.validate(context)));
      switch (item.verb) {
        case 'BelongsTo': {
          const belongsTo = this.validator.getRules('BelongsTo');
          belongsTo.forEach(rule => result.push(...rule.validate(context)));
          break;
        }
        case 'BelongsToMany': {
          const belongsToMany = this.validator.getRules('BelongsToMany');
          belongsToMany.forEach(rule => result.push(...rule.validate(context)));
          break;
        }
        case 'HasOne': {
          const hasOne = this.validator.getRules('HasOne');
          hasOne.forEach(rule => result.push(...rule.validate(context)));
          break;
        }
        case 'HasMany': {
          const hasMany = this.validator.getRules('HasMany');
          hasMany.forEach(rule => result.push(...rule.validate(context)));
          break;
        }
        default:
      }
    } else {
      result.push({
        message: 'Validation context invalid',
        result: ValidationResultType.error,
      });
    }
    return result;
  }

  constructor(validator: Validator, pkg: IFieldContext) {
    this.validator = validator;
    this.context = pkg;
  }
}
