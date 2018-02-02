import { IEntityContext } from './IEntityContext';
import { IField } from './IField';
import { RestartType } from './types';

export interface IFieldContext extends IEntityContext {
  readonly field: IField;
  restart(level: RestartType);
}
