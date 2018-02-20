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

export const RuntimeModelContext = Record(runtimeModelContext);
export const RuntimePackageContext = Record(runtimePackageContext);
export const RuntimeEntityContext = Record(runtimeEntityContext);
export const RuntimeFieldContext = Record(runtimeFieldContext);
export const RuntimeRelationContext = Record(runtimeRelationContext);
export const RuntimeMutationContext = Record(runtimeMutationContext);
export const RuntimeEnumContext = Record(runtimeEnumContext);
