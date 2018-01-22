import { IModelType, IModelTypeProps } from './IModelType';
import { IField } from './IField';
import { IEntityContext } from './IEntityContext';

export type EntityProps = IModelTypeProps & {
  plural: string;
  relations: Set<string>;
  required: Set<string>;
  indexed: Set<string>;
  fields: Map<string, IField>;
};

export interface IEntity extends IModelType<EntityProps> {
  readonly modelType: 'entity';
}
