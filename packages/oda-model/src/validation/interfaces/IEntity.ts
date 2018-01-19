import { IModelType } from './IModelType';
import { IField } from './IField';

export interface IEntity extends IModelType {
  modelType: 'entity';
  plural: string;
  relations: Set<string>;
  required: Set<string>;
  indexed: Set<string>;
  fields: Map<string, IField>;
}

