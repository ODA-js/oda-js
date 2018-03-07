// tslint:disable:variable-name
import { Record } from 'immutable';
import { IContext } from '../contexts/IContext';
import { IModelContext } from '../contexts/IModelContext';
import { IPackageContext } from '../contexts/IPackageContext';
import { IEntityContext } from '../contexts/IEntityContext';
import { IFieldContext } from '../contexts/IFieldContext';
import { IRelationContext } from '../contexts/IRelationContext';
import { IMutationContext } from '../contexts/IMutationContext';
import { IEnumContext } from '../contexts/IEnumContext';
import { IValidationContext } from '../contexts/IValidationContext';
import { IValidationResult } from '../interfaces/IValidationResult';
import { restart } from '../contexts/restart';
import { RestartType } from '../interfaces/types';
import { IModel } from '../interfaces/IModel';

const runtimeContext: IContext = {};

const runtimeModelContext: IModelContext = {
  ...runtimeContext,
  model: null,
};

const runtimePackageContext: IPackageContext = {
  ...runtimeModelContext,
  package: null,
};

const runtimeEntityContext: IEntityContext = {
  ...runtimePackageContext,
  entity: null,
};

const runtimeFieldContext: IFieldContext = {
  ...runtimeEntityContext,
  field: null,
};

const runtimeRelationContext: IRelationContext = {
  ...runtimeFieldContext,
  relation: null,
};

const runtimeMutationContext: IMutationContext = {
  ...runtimePackageContext,
  mutation: null,
};

const runtimeEnumContext: IEnumContext = {
  ...runtimePackageContext,
  enum: null,
};

export const RuntimeContext = Record(runtimeContext);
export const RuntimeModelContext = Record(runtimeModelContext);
export const RuntimePackageContext = Record(runtimePackageContext);
export const RuntimeEntityContext = Record(runtimeEntityContext);
export const RuntimeFieldContext = Record(runtimeFieldContext);
export const RuntimeRelationContext = Record(runtimeRelationContext);
export const RuntimeMutationContext = Record(runtimeMutationContext);
export const RuntimeEnumContext = Record(runtimeEnumContext);

export class ValidationModelContext implements IModelContext, IValidationContext {
  public get isValid() {
    return !!(this.model && Array.isArray(this.errors));
  }
  public get errors(): IValidationResult[] {
    return this._errors;
  }
  public get model(): IModel {
    return this._context.model;
  }
  protected _context: Record<IModelContext> & Readonly<IModelContext>;
  protected _errors: IValidationResult[];
  constructor(init: Readonly<IModelContext>) {
    this._context = new RuntimeModelContext(init);
    this._errors = [];
  }

  public restart(level: RestartType) {
    restart('model');
  }
}
