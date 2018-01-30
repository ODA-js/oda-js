import { Map } from 'immutable';

import { IEntityRef } from './IEntityRef';
import { IField } from './IField';
import { IModelType, INamedItem } from './IModelType';
import { MetaModelType, RelationType } from './types';


// metadata attributes
export interface IRelationStorage {
  single: boolean;
  stored: boolean;
  embedded: boolean;
}

export interface IRelationName {
  fullName: string;
  normalName: string;
  shortName: string;
}
// props
export interface IRelationStore extends IRelationName, IRelationStorage, INamedItem {
  verb: RelationType;
  opposite?: string;
  fields?: Map<string, IField>;
}

export interface IRelationInit extends IRelationName, IRelationStorage, INamedItem {
  verb: RelationType;
  opposite?: string;
  fields?: IField[];
}

export interface IRelation extends IModelType {
  readonly modelType: MetaModelType;
  readonly verb: RelationType;
  readonly ref: IEntityRef;
  readonly opposite?: string;
  readonly fields?: Map<string, IField>;
}
