import { IEntity } from '../interfaces/IEntity';
import { IEntityContext } from './IEntityContext';
import { IModel } from '../interfaces/IModel';
import { IPackage } from '../interfaces/IPackage';
import { IPackageContext } from './IPackageContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { RestartType } from '../interfaces/types';
import { restart } from './restart';
import { IField } from '../interfaces/IField';
import { IFieldContext } from './IFieldContext';
import { isIEntityContext, isField } from '../helpers';
import { IValidationContext } from './IValidationContext';

export class FieldContext implements IFieldContext, IValidationContext {
  public model: IModel;
  public package: IPackage;
  public entity: IEntity;
  public field: IField;
  public errors: IValidationResult[];
  constructor(context: IEntityContext & IValidationContext, field: IField) {
    if (isIEntityContext(context)) {
      this.model = context.model;
      this.package = context.package;
      this.entity = context.entity;
      this.field = isField(field) && field;
      this.errors = [];
    }
  }
  public get isValid() {
    return !!(
      this.model &&
      this.package &&
      this.entity &&
      this.field &&
      Array.isArray(this.errors)
    );
  }

  public restart(level: RestartType) {
    restart('field');
  }
}
