import { IEntity } from '../interfaces/IEntity';
import { IField } from '../interfaces/IField';
import { IFieldContext } from './IFieldContext';
import { IModel } from '../interfaces/IModel';
import { IPackage } from '../interfaces/IPackage';
import { IRelation } from '../interfaces/IRelation';
import { IRelationContext } from './IRelationContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { RestartType } from '../interfaces/types';
import { restart } from './restart';
import { isIFieldContext, isRelation } from '../helpers';

export class RelationContext implements IRelationContext {
  public model: IModel;
  public package: IPackage;
  public entity: IEntity;
  public field: IField;
  public relation: IRelation;
  public errors: IValidationResult[];
  constructor(context: IFieldContext, relation: IRelation) {
    if (isIFieldContext(context)) {
      this.model = context.model;
      this.package = context.package;
      this.entity = context.entity;
      this.field = context.field;
      this.relation = isRelation(relation) && relation;
    }
  }
  public get isValid() {
    return !!(
      this.model
      && this.package
      && this.entity
      && this.field
      && this.relation
      && Array.isArray(this.errors)
    );
  }
  public restart(level: RestartType) {
    restart('relation');
  }
}