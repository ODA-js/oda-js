import { IEntityContext } from '../contexts/IEntityContext';
import { IFieldContext } from '../contexts/IFieldContext';
import { IModelContext } from '../contexts/IModelContext';
import { IPackageContext } from '../contexts/IPackageContext';
import { IRelationContext } from '../contexts/IRelationContext';
import { IBelongsToInit } from './IBelongsTo';
import { IBelongsToManyInit } from './IBelongsToMany';
import { IHasManyInit } from './IHasMany';
import { IHasOneInit } from './IHasOne';

export type RelationType = 'HasMany' | 'HasOne' | 'BelongsToMany' | 'BelongsTo';

export type MetaModelType =
  |'model'
  | 'package'
  | 'mutation'
  | 'entity'
  | 'enum'
  | 'field'
  | 'ref'
  | 'relation'
  ;

export type ValdatedTypes = MetaModelType | RelationType;

export type ValidationContext =
  IModelContext | IPackageContext | IEntityContext | IFieldContext | IRelationContext;

export type RestartType = 'model' | 'package' | 'entity' | 'field' | 'relation' | 'mutation' | 'enum';

export type RelationInit = IHasManyInit | IHasOneInit | IBelongsToInit | IBelongsToManyInit;
