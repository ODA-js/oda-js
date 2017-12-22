import { IEntity, IField, IModel, IPackage, IRelation, IValidationResult } from '../interfaces';
import { IEntityContext, IFieldContext, IModelContext, IPackageContext, IRelationContext } from './interfaces';

export class ModelContext implements IModelContext {
  public model: IModel;
  public errors: IValidationResult[];
  constructor(model: IModel) {
    this.model = model;
    this.errors = [];
  }
  public get isValid() {
    return !!(this.model);
  }
}

export class PackageContext implements IPackageContext {
  public name: string;
  public model: IModel;
  public package: IPackage;
  public errors: IValidationResult[];
  constructor(context: IModelContext, pkg: IPackage) {
    this.model = context.model;
    this.package = pkg;
    this.errors = [];
  }
  public get isValid() {
    return !!(this.model && this.package);
  }
}

export class EntityContext implements IEntityContext {
  public entity: IEntity;
  public model: IModel;
  public package: IPackage;
  public errors: IValidationResult[];
  constructor(context: IPackageContext, entity: IEntity) {
    this.model = context.model;
    this.package = context.package;
    this.entity = entity;
    this.errors = [];
  }
  public get isValid() {
    return !!(this.model && this.package && this.entity);
  }
}

export class FieldContext implements IFieldContext {
  public model: IModel;
  public package: IPackage;
  public entity: IEntity;
  public field: IField;
  public errors: IValidationResult[];
  constructor(context: IEntityContext, field: IField) {
    this.model = context.model;
    this.package = context.package;
    this.entity = context.entity;
    this.field = field;
  }
  public get isValid() {
    return !!(this.model && this.package && this.entity && this.field);
  }
}

export class RelationContext implements IRelationContext {
  public model: IModel;
  public package: IPackage;
  public entity: IEntity;
  public field: IField;
  public relation: IRelation;
  public errors: IValidationResult[];
  constructor(context: IFieldContext, relation: IRelation) {
    this.model = context.model;
    this.package = context.package;
    this.entity = context.entity;
    this.field = context.field;
    this.relation = relation;
  }
  public get isValid() {
    return !!(this.model && this.package && this.entity && this.field && this.relation);
  }
}
