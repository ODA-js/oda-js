import { IEntity } from '../interfaces/IEntity';
import { IEntityContext } from '../interfaces/IEntityContext';
import { IModel } from '../interfaces/IModel';
import { IPackage } from '../interfaces/IPackage';
import { IPackageContext } from '../interfaces/IPackageContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { RestartType } from '../interfaces/types';
import { restart } from './restart';
import { IField } from '../interfaces/IField';
import { IFieldContext } from '../interfaces/IFieldContext';

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

  public restart(level: RestartType) {
    restart('field');
  }
}
